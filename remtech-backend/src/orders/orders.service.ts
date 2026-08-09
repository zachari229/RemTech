import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChariowService } from '../chariow/chariow.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private prisma: PrismaService,
    private chariow: ChariowService,
    private mail: MailService,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    // Vérifier que la formation existe et est publiée
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) throw new NotFoundException('Formation introuvable');
    if (course.status !== 'PUBLIE') {
      throw new BadRequestException('Cette formation n\'est pas disponible');
    }
    if (!course.chariowProductId) {
      throw new BadRequestException(
        'Cette formation n\'est pas encore configurée pour le paiement',
      );
    }

    // Vérifier si déjà acheté
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        courseId: dto.courseId,
        status: 'PAYE',
      },
    });

    if (existingOrder) {
      throw new BadRequestException('Vous avez déjà acheté cette formation');
    }

    // Récupérer les infos de l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Générer une référence unique interne
    const paymentRef = `RT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Initier le paiement chez Chariow
    const checkoutResult = await this.chariow.initiateCheckout({
      product_id: course.chariowProductId,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: {
        number: dto.phoneNumber,
        country_code: dto.countryCode,
      },
      redirect_url:
        dto.redirectUrl ||
        `${process.env.FRONTEND_URL}/dashboard/orders?ref=${paymentRef}`,
      custom_metadata: {
        order_ref: paymentRef,
        course_id: String(course.id),
        user_id: String(userId),
      },
    });

    // Si le client a déjà acheté ce produit côté Chariow
    if (checkoutResult.data?.step === 'already_purchased') {
      throw new BadRequestException('Vous avez déjà acheté cette formation');
    }

    const checkoutUrl = checkoutResult.data?.payment?.checkout_url || null;
    const chariowSaleId = checkoutResult.data?.purchase?.id || null;

    // Créer la commande en base, en attente de paiement
    const order = await this.prisma.order.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: course.price,
        paymentRef,
        chariowRef: chariowSaleId,
        checkoutUrl,
        status: 'EN_ATTENTE',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            slug: true,
          },
        },
      },
    });

    return {
      message: 'Commande créée, redirection vers le paiement',
      order,
      paymentUrl: checkoutUrl,
    };
  }

  async confirmPayment(dto: ConfirmPaymentDto) {
    // Trouver la commande
    const order = await this.prisma.order.findUnique({
      where: { paymentRef: dto.paymentRef },
      include: { course: true, user: true },
    });

    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.status === 'PAYE') {
      throw new BadRequestException('Cette commande est déjà payée');
    }

    // Mettre à jour la commande
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAYE',
        chariowRef: dto.reference,
      },
    });

    // Créer le paiement
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.amount,
        reference: dto.reference,
        provider: 'chariow',
      },
    });

    // Créer l'enrollment (débloquer la formation)
    await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: order.userId,
          courseId: order.courseId,
        },
      },
      create: {
        userId: order.userId,
        courseId: order.courseId,
      },
      update: {},
    });

    // Créer une notification
    await this.prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Paiement confirmé',
        message: `Votre achat de "${order.course.title}" a été confirmé. Bonne formation !`,
      },
    });

    // Envoi de l'email de confirmation
    await this.mail.sendOrderConfirmation({
      to: order.user.email,
      firstName: order.user.firstName,
      courseTitle: order.course.title,
      courseSlug: order.course.slug,
      amount: Number(order.amount),
    });

    return {
      message: 'Paiement confirmé, formation débloquée',
      order: updatedOrder,
    };
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            media: { where: { isPrimary: true }, take: 1 },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: true,
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

async handleChariowWebhook(
    payload: { event: string; data: any },
    token: string,
  ) {
    // 1. Vérifier le token secret de l'URL
    if (token !== process.env.CHARIOW_WEBHOOK_TOKEN) {
      this.logger.warn('Webhook Chariow reçu avec un token invalide');
      throw new ForbiddenException('Token invalide');
    }

    this.logger.log(`Webhook Chariow reçu : ${payload?.event}`);

    const event = payload?.event;
    const data = payload?.data;

    if (!data) {
      return { received: true };
    }

    // On ne traite que les ventes finalisées
    if (event === 'sale.completed' || event === 'sale.paid') {
      const orderRef = data.custom_metadata?.order_ref;
      const chariowSaleId = data.id;

      if (!orderRef) {
        this.logger.warn('Webhook sans order_ref dans custom_metadata, ignoré');
        return { received: true };
      }

      const order = await this.prisma.order.findUnique({
        where: { paymentRef: orderRef },
        include: { course: true },
      });

      if (!order) {
        this.logger.warn(`Commande introuvable pour la référence ${orderRef}`);
        return { received: true };
      }

      if (order.status === 'PAYE') {
        // Déjà traité (Chariow peut renvoyer le même webhook plusieurs fois)
        return { received: true };
      }

      // 2. Re-vérification auprès de l'API Chariow avant de débloquer quoi que ce soit
      if (chariowSaleId) {
        const verification = await this.chariow.verifySale(chariowSaleId);

        if (!verification.valid || verification.status !== 'completed') {
          this.logger.warn(
            `Vente Chariow ${chariowSaleId} non confirmée par l'API (status: ${verification.status})`,
          );
          return { received: true };
        }
      }

      // Mettre à jour la commande
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAYE',
          chariowRef: chariowSaleId,
        },
      });

      // Créer le paiement
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.amount,
          reference: chariowSaleId || orderRef,
          provider: 'chariow',
        },
      });

      // Débloquer la formation
      await this.prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: order.userId,
            courseId: order.courseId,
          },
        },
        create: {
          userId: order.userId,
          courseId: order.courseId,
        },
        update: {},
      });

      // Notification interne
      await this.prisma.notification.create({
        data: {
          userId: order.userId,
          title: 'Paiement confirmé',
          message: `Votre achat de "${order.course.title}" a été confirmé. Bonne formation !`,
        },
      });

      // Envoi de l'email de confirmation
      const userForMail = await this.prisma.user.findUnique({
        where: { id: order.userId },
        select: { email: true, firstName: true },
      });

      if (userForMail) {
        await this.mail.sendOrderConfirmation({
          to: userForMail.email,
          firstName: userForMail.firstName,
          courseTitle: order.course.title,
          courseSlug: order.course.slug,
          amount: Number(order.amount),
        });
      }

      this.logger.log(`Commande ${order.id} marquée PAYÉ via webhook Chariow`);
    }

    if (event === 'sale.refunded') {
      const orderRef = data.custom_metadata?.order_ref;
      if (orderRef) {
        await this.prisma.order.updateMany({
          where: { paymentRef: orderRef },
          data: { status: 'REMBOURSE' },
        });
        this.logger.log(`Commande ${orderRef} marquée REMBOURSÉ via webhook Chariow`);
      }
    }

    return { received: true };
  }
}
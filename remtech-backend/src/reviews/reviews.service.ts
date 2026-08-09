import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    // Vérifier que l'étudiant a acheté la formation
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: dto.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new BadRequestException(
        'Vous devez acheter la formation avant de laisser un avis',
      );
    }

    // Vérifier qu'il n'a pas déjà laissé un avis
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: dto.courseId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour cette formation');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        courseId: dto.courseId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    return { message: 'Avis soumis, en attente de validation', review };
  }

  async findByCourse(courseId: number) {
    return this.prisma.review.findMany({
      where: { courseId, isVisible: true },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Avis introuvable');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { isVisible: true },
    });

    return { message: 'Avis approuvé', review: updated };
  }

  async reply(id: number, dto: ReplyReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Avis introuvable');

    const updated = await this.prisma.review.update({
      where: { id },
      data: { reply: dto.reply },
    });

    return { message: 'Réponse ajoutée', review: updated };
  }

  async remove(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Avis introuvable');

    await this.prisma.review.delete({ where: { id } });
    return { message: 'Avis supprimé' };
  }

  async getPublicStats() {
  const stats = await this.prisma.review.aggregate({
    where: { isVisible: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : null,
    totalReviews: stats._count.rating,
  };
}
}
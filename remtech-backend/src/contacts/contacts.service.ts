import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service'; 
import { CreateContactDto } from './dto/create-contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService, private mailService: MailService ) {}

  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
      },
    });

    return { message: 'Message envoyé avec succès', contact };
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Message introuvable');

    // Marquer comme lu
    if (!contact.isRead) {
      await this.prisma.contact.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return contact;
  }

   async reply(id: number, dto: ReplyContactDto) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Message introuvable');

    const updated = await this.prisma.contact.update({
      where: { id },
      data: { reply: dto.reply },
    });

    try {
      await this.mailService.sendContactReply({
        to: contact.email,
        firstName: contact.name,
        originalSubject: contact.subject,
        originalMessage: contact.message,
        reply: dto.reply,
      });
    } catch (error) {

      throw new BadRequestException(
        'Réponse enregistrée, mais l\'envoi de l\'email a échoué. Vérifiez la configuration SMTP.',
      );
    }

    return { message: 'Réponse envoyée', contact: updated };
  }

  async remove(id: number) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Message introuvable');

    await this.prisma.contact.delete({ where: { id } });
    return { message: 'Message supprimé' };
  }
}
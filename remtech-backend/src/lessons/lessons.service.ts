import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateLessonDto, LessonType } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(moduleId: number, dto: CreateLessonDto, file: Express.Multer.File) {
    const moduleRecord = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleRecord) throw new NotFoundException('Module introuvable');

    if (!file) throw new BadRequestException('Aucun fichier fourni');

    const resourceType = dto.type === LessonType.VIDEO ? 'video' : 'raw';
    const expectedMimePrefix = dto.type === LessonType.VIDEO ? 'video/' : 'application/pdf';

    if (!file.mimetype.startsWith(expectedMimePrefix)) {
      throw new BadRequestException(
        dto.type === LessonType.VIDEO
          ? 'Le fichier doit être une vidéo'
          : 'Le fichier doit être un PDF',
      );
    }

    const uploadResult = await this.cloudinary.uploadFile(file, resourceType);
    const count = await this.prisma.lesson.count({ where: { moduleId } });

    return this.prisma.lesson.create({
      data: {
        moduleId,
        title: dto.title,
        type: dto.type,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        duration: dto.duration,
        order: dto.order ?? count,
      },
    });
  }

  async update(id: number, dto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Leçon introuvable');

    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Leçon introuvable');

    const resourceType = lesson.type === 'VIDEO' ? 'video' : 'raw';
    await this.cloudinary.deleteFile(lesson.publicId, resourceType).catch(() => {});

    await this.prisma.lesson.delete({ where: { id } });
    return { message: 'Leçon supprimée' };
  }
}
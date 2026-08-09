import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: number, dto: CreateModuleDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Formation introuvable');

    const count = await this.prisma.module.count({ where: { courseId } });

    return this.prisma.module.create({
      data: {
        courseId,
        title: dto.title,
        order: dto.order ?? count,
      },
      include: { lessons: true },
    });
  }

  async findAllForCourse(courseId: number) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }

  async update(id: number, dto: UpdateModuleDto) {
    const found = await this.prisma.module.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Module introuvable');

    return this.prisma.module.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const found = await this.prisma.module.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Module introuvable');

    await this.prisma.module.delete({ where: { id } });
    return { message: 'Module supprimé' };
  }
}
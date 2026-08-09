import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.generateSlug(dto.name);

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Une catégorie avec ce nom existe déjà');
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        icon: dto.icon,
      },
    });

    return { message: 'Catégorie créée', category };
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        courses: {
          where: { status: 'PUBLIE' },
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            level: true,
            duration: true,
            media: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) throw new NotFoundException('Catégorie introuvable');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Catégorie introuvable');

    const data: any = { ...dto };

    if (dto.name) {
      const slug = this.generateSlug(dto.name);
      const existing = await this.prisma.category.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) throw new BadRequestException('Une catégorie avec ce nom existe déjà');
      data.slug = slug;
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data,
    });

    return { message: 'Catégorie mise à jour', category: updated };
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } },
    });

    if (!category) throw new NotFoundException('Catégorie introuvable');

    if (category._count.courses > 0) {
      throw new BadRequestException(
        'Impossible de supprimer une catégorie contenant des formations',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Catégorie supprimée' };
  }
}
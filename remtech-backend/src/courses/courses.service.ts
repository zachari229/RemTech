import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(dto: CreateCourseDto, media?: Express.Multer.File[]) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new BadRequestException('Catégorie introuvable');

    let slug = this.generateSlug(dto.title);
    const existing = await this.prisma.course.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const course = await this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        shortDescription: dto.shortDescription,
        fullDescription: dto.fullDescription,
        price: dto.price,
        level: dto.level,
        duration: dto.duration,
        objectives: dto.objectives,
        prerequisites: dto.prerequisites,
        categoryId: dto.categoryId,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
      },
    });

    // Upload des médias (images/vidéos) sur Cloudinary
    if (media && media.length > 0) {
      for (let i = 0; i < media.length; i++) {
        const file = media[i];
        const isVideo = file.mimetype.startsWith('video');
        const resourceType: 'video' | 'image' = isVideo ? 'video' : 'image';

        const result = await this.cloudinary.uploadFile(
          file,
          resourceType,
          'remtech/courses',
        );

        await this.prisma.courseMedia.create({
          data: {
            courseId: course.id,
            url: result.secure_url,
            publicId: result.public_id,
            type: isVideo ? 'VIDEO' : 'IMAGE',
            isPrimary: i === 0,
          },
        });
      }
    }

    const fullCourse = await this.prisma.course.findUnique({
      where: { id: course.id },
      include: { category: true, media: true },
    });

    return { message: 'Formation créée', course: fullCourse };
  }

  async findAll(filters?: {
    search?: string;
    categoryId?: number;
    level?: string;
    sortBy?: string;
  }) {
    const where: any = { status: 'PUBLIE' };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { shortDescription: { contains: filters.search } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.level) {
      where.level = filters.level;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (filters?.sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (filters?.sortBy === 'date') orderBy = { createdAt: 'desc' };

    return this.prisma.course.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        media: { where: { isPrimary: true }, take: 1 },
        _count: { select: { enrollments: true, reviews: true } },
      },
      orderBy,
    });
  }

  async findAllAdmin() {
    return this.prisma.course.findMany({
      include: {
        category: { select: { id: true, name: true } },
        media: { where: { isPrimary: true }, take: 1 },
        _count: { select: { enrollments: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        media: true,
        modules: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) throw new NotFoundException('Formation introuvable');
    return course;
  }

  async findOneById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        media: true,
        modules: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });

    if (!course) throw new NotFoundException('Formation introuvable');
    return course;
  }

  async update(id: number, dto: UpdateCourseDto, media?: Express.Multer.File[]) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Formation introuvable');

    const data: any = { ...dto };

    if (dto.title) {
      let slug = this.generateSlug(dto.title);
      const existing = await this.prisma.course.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) slug = `${slug}-${Date.now()}`;
      data.slug = slug;
    }

    const updated = await this.prisma.course.update({
      where: { id },
      data,
      include: { category: true },
    });

    // Upload des nouveaux médias si présents
    if (media && media.length > 0) {
      const existingPrimary = await this.prisma.courseMedia.findFirst({
        where: { courseId: id, isPrimary: true, type: 'IMAGE' },
      });

      for (let i = 0; i < media.length; i++) {
        const file = media[i];
        const isVideo = file.mimetype.startsWith('video');

        const result = await this.cloudinary.uploadFile(
          file,
          isVideo ? 'video' : 'image',
          'remtech/courses',
        );

        // La première nouvelle image devient principale si aucune n'existait déjà
        const shouldBePrimary = !isVideo && !existingPrimary && i === 0;

        await this.prisma.courseMedia.create({
          data: {
            courseId: id,
            url: result.secure_url,
            publicId: result.public_id,
            type: isVideo ? 'VIDEO' : 'IMAGE',
            isPrimary: shouldBePrimary,
          },
        });
      }
    }

    return { message: 'Formation mise à jour', course: updated };
  }

  async remove(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Formation introuvable');

    await this.prisma.course.delete({ where: { id } });
    return { message: 'Formation supprimée' };
  }

  async publish(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Formation introuvable');

    const updated = await this.prisma.course.update({
      where: { id },
      data: { status: 'PUBLIE' },
    });

    return { message: 'Formation publiée', course: updated };
  }

  async unpublish(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Formation introuvable');

    const updated = await this.prisma.course.update({
      where: { id },
      data: { status: 'BROUILLON' },
    });

    return { message: 'Formation dépubliée', course: updated };
  }
}
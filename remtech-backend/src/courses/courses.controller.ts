import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Public — liste des formations
  @Get()
  @ApiOperation({ summary: 'Liste des formations publiées (public)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('level') level?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.coursesService.findAll({
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      level,
      sortBy,
    });
  }

  // Public — voir une formation par slug
  @Get(':slug')
  @ApiOperation({ summary: 'Voir une formation (public)' })
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findOne(slug);
  }

  // Admin — liste complète
  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Liste complète des formations (Admin)' })
  findAllAdmin() {
    return this.coursesService.findAllAdmin();
  }

  // Admin — créer
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('media', 3))
  @ApiOperation({ summary: 'Créer une formation (Admin)' })
  create(
    @Body() dto: CreateCourseDto,
    @UploadedFiles() media: Express.Multer.File[],
  ) {
    return this.coursesService.create(dto, media);
  }

  // Admin — modifier
  @Patch(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('media', 3))
  @ApiOperation({ summary: 'Modifier une formation (Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
    @UploadedFiles() media: Express.Multer.File[],
  ) {
    return this.coursesService.update(id, dto, media);
  }

  // Admin — publier
  @Patch(':id/publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Publier une formation (Admin)' })
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.publish(id);
  }

  // Admin — dépublier
  @Patch(':id/unpublish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Dépublier une formation (Admin)' })
  unpublish(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.unpublish(id);
  }

  // Admin — supprimer
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer une formation (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
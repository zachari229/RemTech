import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Public — avis d'une formation
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Avis d\'une formation (public)' })
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.reviewsService.findByCourse(courseId);
  }

  // Public — statistiques globales (note moyenne)
@Get('stats')
@ApiOperation({ summary: 'Statistiques publiques des avis' })
getPublicStats() {
  return this.reviewsService.getPublicStats();
}

  // Étudiant — laisser un avis
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Laisser un avis' })
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  // Admin — tous les avis
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tous les avis (Admin)' })
  findAll() {
    return this.reviewsService.findAll();
  }

  // Admin — approuver
  @Patch(':id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Approuver un avis (Admin)' })
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.approve(id);
  }

  // Admin — répondre
  @Patch(':id/reply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Répondre à un avis (Admin)' })
  reply(@Param('id', ParseIntPipe) id: number, @Body() dto: ReplyReviewDto) {
    return this.reviewsService.reply(id, dto);
  }

  // Admin — supprimer
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un avis (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
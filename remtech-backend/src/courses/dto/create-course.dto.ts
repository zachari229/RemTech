import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum CourseLevel {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE',
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Développement Web avec React' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Apprenez React de zéro à expert' })
  @IsString()
  @MinLength(10)
  shortDescription: string;

  @ApiProperty({ example: 'Description complète du cours...' })
  @IsString()
  @MinLength(20)
  fullDescription: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: '10 heures' })
  @IsString()
  duration: string;

  @ApiProperty({ example: ['Maîtriser React', 'Créer des apps modernes'] })
  @IsArray()
  objectives: string[];

  @ApiProperty({ example: ['HTML/CSS', 'JavaScript de base'] })
  @IsArray()
  prerequisites: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 'Titre SEO', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ example: 'Description SEO', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ example: 'prd_abc123', required: false, description: 'ID du produit correspondant sur Chariow' })
  @IsOptional()
  @IsString()
  chariowProductId?: string;
}
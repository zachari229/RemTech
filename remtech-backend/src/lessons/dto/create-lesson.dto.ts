import { IsString, IsEnum, IsOptional, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum LessonType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
}

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction aux hooks' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ enum: LessonType })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiProperty({ example: '12:30', required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  order?: number;
}
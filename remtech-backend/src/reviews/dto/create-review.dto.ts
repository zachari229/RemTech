import { IsNumber, IsString, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  courseId: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({ example: 'Excellente formation, très bien expliquée !' })
  @IsString()
  @MinLength(10)
  comment: string;
}
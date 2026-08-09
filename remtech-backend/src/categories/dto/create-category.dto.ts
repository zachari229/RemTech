import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Développement Web' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Une icône (optionnel)', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
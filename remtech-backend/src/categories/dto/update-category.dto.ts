import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Développement Web', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'code', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
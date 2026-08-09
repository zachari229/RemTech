import { IsString, IsOptional, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateModuleDto {
  @ApiProperty({ example: 'Introduction à React' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  order?: number;
}
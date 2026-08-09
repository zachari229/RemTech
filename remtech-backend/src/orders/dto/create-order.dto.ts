import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  courseId: number;

  @ApiProperty({ example: '0612345678', description: 'Numéro de téléphone requis par Chariow' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'BJ', description: 'Code pays ISO (ex: BJ pour le Bénin, FR, US)' })
  @IsString()
  countryCode: string;

  @ApiProperty({ required: false, description: 'URL de redirection après paiement (optionnel)' })
  @IsOptional()
  @IsString()
  redirectUrl?: string;
}
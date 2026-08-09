import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'ref_chariow_123' })
  @IsString()
  reference: string;

  @ApiProperty({ example: 'order_ref_123' })
  @IsString()
  paymentRef: string;
}
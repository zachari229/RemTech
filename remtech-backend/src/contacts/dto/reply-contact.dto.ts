import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyContactDto {
  @ApiProperty({ example: 'Bonjour, merci pour votre message...' })
  @IsString()
  @MinLength(10)
  reply: string;
}
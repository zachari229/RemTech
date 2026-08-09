import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyReviewDto {
  @ApiProperty({ example: 'Merci pour votre avis !' })
  @IsString()
  @MinLength(5)
  reply: string;
}
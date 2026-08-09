import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'token_recu_par_email' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'nouveau_motdepasse123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
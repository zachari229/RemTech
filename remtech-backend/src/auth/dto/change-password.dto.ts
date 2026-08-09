import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'ancien_motdepasse123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'nouveau_motdepasse123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
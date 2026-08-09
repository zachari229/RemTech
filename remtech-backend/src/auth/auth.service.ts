import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Inscription réussie',
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte a été suspendu');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Connexion réussie',
      token,
      user: this.sanitizeUser(user),
    };
  }

 async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    return { message: 'Si cet email existe, un code de réinitialisation a été envoyé' };
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: code,
      resetTokenExpiry: expiry,
    },
  });

  await this.mailService.sendResetCode({
    to: user.email,
    firstName: user.firstName,
    code,
  });

  return { message: 'Si cet email existe, un code de réinitialisation a été envoyé' };
}

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return this.sanitizeUser(user);
  }

  async validateOAuthUser(googleUser: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  let user = await this.prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    // Mot de passe aléatoire haché — l'utilisateur ne s'en servira jamais,
    // il se connectera toujours via Google
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await this.prisma.user.create({
  data: {
    firstName: googleUser.firstName || 'Utilisateur',
    lastName: googleUser.lastName || 'Google',
    email: googleUser.email,
    password: hashedPassword,
  },
});
  }

  if (!user.isActive) {
    throw new UnauthorizedException('Votre compte a été suspendu');
  }

  const token = this.generateToken(user.id, user.email, user.role);

  return {
    message: 'Connexion réussie',
    token,
    user: this.sanitizeUser(user),
  };
}

  private generateToken(userId: number, email: string, role: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }

  private sanitizeUser(user: any) {
    const { password, resetToken, resetTokenExpiry, ...rest } = user;
    return rest;
  }
}
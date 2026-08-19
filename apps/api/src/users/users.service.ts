import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { ResendEmailChangeDto } from './dto/resend-email-change.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { agentProfile: true },
    });
    if (!user) {
      throw new NotFoundException({ message: 'User not found', code: 'USER_NOT_FOUND' });
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      agentProfile: user.agentProfile,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    if (dto.name) {
      dto = { ...dto, name: dto.name.trim() };
    }
    if (dto.phone !== undefined) {
      dto = { ...dto, phone: dto.phone.trim() || undefined };
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto, response: Response) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }
    const valid = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!valid) {
      throw new UnauthorizedException({
        message: 'Current password is incorrect',
        code: 'INVALID_PASSWORD',
      });
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException({
        message: 'New password must be different from the current password',
        code: 'SAME_PASSWORD',
      });
    }
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await argon2.hash(dto.newPassword) },
    });
    await this.auth.rotateSession(updated.id, updated.email, updated.role, response);
    return { updated: true };
  }

  requestEmailChange(userId: string, dto: RequestEmailChangeDto) {
    return this.auth.requestEmailChange(userId, dto.email, dto.password);
  }

  resendEmailChange(userId: string, dto: ResendEmailChangeDto) {
    return this.auth.resendEmailChange(userId, dto.email);
  }

  confirmEmailChange(userId: string, dto: VerifyEmailChangeDto, response: Response) {
    return this.auth.confirmEmailChange(userId, dto.email, dto.code, response);
  }
}

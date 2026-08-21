import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpPurpose, type Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';
import type { CookieOptions, Response } from 'express';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { OtpPurposeDto } from './dto/otp-purpose.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const ACCESS_COOKIE = 'estatex_access';
const REFRESH_COOKIE = 'estatex_refresh';
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TTL_MS = 15 * 60 * 1000;

type RegisterPayload = {
  name: string;
  passwordHash: string;
  phone?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException({
        message: 'An account with this email already exists',
        code: 'EMAIL_TAKEN',
      });
    }

    return this.issueOtp({
      email,
      purpose: OtpPurpose.REGISTER,
      payload: {
        name: dto.name.trim(),
        passwordHash: await argon2.hash(dto.password),
        phone: dto.phone?.trim() || undefined,
      } satisfies RegisterPayload,
    });
  }

  async login(dto: LoginDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: this.normalizeEmail(dto.email) },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    if (!user.emailVerifiedAt) {
      const issued = await this.issueOtp({
        email: user.email,
        purpose: OtpPurpose.LOGIN,
      });
      return { next: 'verify_email' as const, ...issued };
    }

    await this.issueSession(user.id, user.email, user.role, response);
    return { next: 'authenticated' as const, user: this.safeUser(user) };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user?.isActive) {
      return this.issueOtp({
        email,
        purpose: OtpPurpose.RESET_PASSWORD,
      });
    }

    return this.otpIssuedResponse(email, OtpPurpose.RESET_PASSWORD);
  }

  async resendOtp(dto: OtpPurposeDto) {
    const email = this.normalizeEmail(dto.email);

    if (dto.purpose === OtpPurpose.CHANGE_EMAIL) {
      throw new BadRequestException({
        message: 'Email changes must be completed from account settings',
        code: 'INVALID_PURPOSE',
      });
    }

    if (dto.purpose === OtpPurpose.REGISTER) {
      const pending = await this.latestActiveChallenge(email, OtpPurpose.REGISTER);
      if (!pending?.payload) {
        throw new BadRequestException({
          message: 'No pending registration found for this email',
          code: 'NO_PENDING_REGISTRATION',
        });
      }
      return this.issueOtp({
        email,
        purpose: OtpPurpose.REGISTER,
        payload: pending.payload as RegisterPayload,
      });
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.isActive) {
      return this.otpIssuedResponse(email, dto.purpose);
    }

    if (dto.purpose === OtpPurpose.LOGIN && user.emailVerifiedAt) {
      throw new BadRequestException({
        message: 'This account is already verified. Sign in with your password.',
        code: 'ALREADY_VERIFIED',
      });
    }

    return this.issueOtp({ email, purpose: dto.purpose });
  }

  async verifyOtp(dto: VerifyOtpDto, response: Response) {
    if (dto.purpose === OtpPurpose.CHANGE_EMAIL) {
      throw new BadRequestException({
        message: 'Email changes must be completed from account settings',
        code: 'INVALID_PURPOSE',
      });
    }

    const email = this.normalizeEmail(dto.email);
    const challenge = await this.consumeOtp(email, dto.purpose, dto.code);

    if (dto.purpose === OtpPurpose.REGISTER) {
      const payload = challenge.payload as RegisterPayload | null;
      if (!payload?.name || !payload.passwordHash) {
        throw new BadRequestException({
          message: 'Registration session expired. Please register again.',
          code: 'OTP_INVALID',
        });
      }

      try {
        const user = await this.prisma.user.create({
          data: {
            name: payload.name,
            email,
            passwordHash: payload.passwordHash,
            phone: payload.phone,
            emailVerifiedAt: new Date(),
          },
        });
        await this.issueSession(user.id, user.email, user.role, response);
        return { next: 'authenticated' as const, user: this.safeUser(user) };
      } catch (error) {
        if (this.isUniqueConstraint(error)) {
          throw new ConflictException({
            message: 'An account with this email already exists',
            code: 'EMAIL_TAKEN',
          });
        }
        throw error;
      }
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    if (dto.purpose === OtpPurpose.LOGIN) {
      const verified = user.emailVerifiedAt
        ? user
        : await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerifiedAt: new Date() },
          });
      await this.issueSession(verified.id, verified.email, verified.role, response);
      return { next: 'authenticated' as const, user: this.safeUser(verified) };
    }

    const resetToken = randomBytes(48).toString('hex');
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(resetToken),
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    return {
      next: 'reset_password' as const,
      resetToken,
      email: user.email,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    const stored = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: this.hashToken(dto.resetToken) },
    });

    if (
      !user ||
      !stored ||
      stored.userId !== user.id ||
      stored.usedAt ||
      stored.expiresAt < new Date()
    ) {
      throw new BadRequestException({
        message: 'This reset link is invalid or has expired',
        code: 'RESET_TOKEN_INVALID',
      });
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await argon2.hash(dto.password),
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { reset: true };
  }

  async logout(refreshToken: string | undefined, response: Response) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: this.hashToken(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    this.clearCookies(response);
    return { loggedOut: true };
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: 'Refresh token missing',
        code: 'UNAUTHORIZED',
      });
    }

    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || !stored.user.isActive) {
      throw new UnauthorizedException({
        message: 'Refresh token invalid',
        code: 'UNAUTHORIZED',
      });
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    await this.issueSession(
      stored.user.id,
      stored.user.email,
      stored.user.role,
      response,
    );
    return this.safeUser(stored.user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.safeUser(user);
  }

  async requestEmailChange(userId: string, email: string, password: string) {
    const nextEmail = this.normalizeEmail(email);
    const user = await this.requireUser(userId);
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException({
        message: 'Current password is incorrect',
        code: 'INVALID_PASSWORD',
      });
    }
    if (nextEmail === user.email) {
      throw new BadRequestException({
        message: 'This is already your email address',
        code: 'SAME_EMAIL',
      });
    }
    const taken = await this.prisma.user.findUnique({ where: { email: nextEmail } });
    if (taken) {
      throw new ConflictException({
        message: 'An account with this email already exists',
        code: 'EMAIL_TAKEN',
      });
    }
    return this.issueOtp({
      email: nextEmail,
      purpose: OtpPurpose.CHANGE_EMAIL,
      payload: { userId: user.id },
    });
  }

  async resendEmailChange(userId: string, email: string) {
    const nextEmail = this.normalizeEmail(email);
    const pending = await this.latestActiveChallenge(nextEmail, OtpPurpose.CHANGE_EMAIL);
    const payload = pending?.payload as { userId?: string } | null;
    if (!pending || payload?.userId !== userId) {
      throw new BadRequestException({
        message: 'No pending email change found. Start again.',
        code: 'NO_PENDING_EMAIL_CHANGE',
      });
    }
    return this.issueOtp({
      email: nextEmail,
      purpose: OtpPurpose.CHANGE_EMAIL,
      payload: { userId },
    });
  }

  async confirmEmailChange(userId: string, email: string, code: string, response: Response) {
    const nextEmail = this.normalizeEmail(email);
    const challenge = await this.consumeOtp(nextEmail, OtpPurpose.CHANGE_EMAIL, code);
    const payload = challenge.payload as { userId?: string } | null;
    if (payload?.userId !== userId) {
      throw new BadRequestException({
        message: 'Invalid or expired code',
        code: 'OTP_INVALID',
      });
    }
    const taken = await this.prisma.user.findUnique({ where: { email: nextEmail } });
    if (taken) {
      throw new ConflictException({
        message: 'An account with this email already exists',
        code: 'EMAIL_TAKEN',
      });
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { email: nextEmail, emailVerifiedAt: new Date() },
    });
    await this.rotateSession(user.id, user.email, user.role, response);
    return this.safeUser(user);
  }

  async rotateSession(userId: string, email: string, role: string, response: Response) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.issueSession(userId, email, role, response);
  }

  private async requireUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async issueOtp(input: {
    email: string;
    purpose: OtpPurpose;
    payload?: Prisma.InputJsonValue;
  }) {
    await this.assertCooldown(input.email, input.purpose);

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.prisma.otpChallenge.updateMany({
      where: { email: input.email, purpose: input.purpose, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    await this.prisma.otpChallenge.create({
      data: {
        email: input.email,
        purpose: input.purpose,
        codeHash: this.hashOtp(input.email, input.purpose, code),
        payload: input.payload,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });

    await this.mail.sendOtp(input.email, code, input.purpose);
    return this.otpIssuedResponse(input.email, input.purpose, code);
  }

  private async consumeOtp(email: string, purpose: OtpPurpose, code: string) {
    const challenge = await this.latestActiveChallenge(email, purpose);
    if (!challenge) {
      throw new BadRequestException({
        message: 'Invalid or expired code',
        code: 'OTP_INVALID',
      });
    }

    if (challenge.expiresAt < new Date()) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { consumedAt: new Date() },
      });
      throw new BadRequestException({
        message: 'This code has expired. Request a new one.',
        code: 'OTP_EXPIRED',
      });
    }

    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
      throw new HttpException(
        { message: 'Too many incorrect attempts. Request a new code.', code: 'OTP_LOCKED' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const expected = Buffer.from(challenge.codeHash);
    const received = Buffer.from(this.hashOtp(email, purpose, code));
    const matches =
      expected.length === received.length && timingSafeEqual(expected, received);

    if (!matches) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException({
        message: 'Invalid or expired code',
        code: 'OTP_INVALID',
      });
    }

    return this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });
  }

  private async latestActiveChallenge(email: string, purpose: OtpPurpose) {
    return this.prisma.otpChallenge.findFirst({
      where: { email, purpose, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async assertCooldown(email: string, purpose: OtpPurpose) {
    const last = await this.prisma.otpChallenge.findFirst({
      where: { email, purpose },
      orderBy: { createdAt: 'desc' },
    });
    if (last && Date.now() - last.createdAt.getTime() < OTP_COOLDOWN_MS) {
      const retryAfter = Math.ceil(
        (OTP_COOLDOWN_MS - (Date.now() - last.createdAt.getTime())) / 1000,
      );
      throw new HttpException(
        {
          message: `Please wait ${retryAfter}s before requesting another code`,
          code: 'OTP_COOLDOWN',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private otpIssuedResponse(email: string, purpose: OtpPurpose, code?: string) {
    return {
      email,
      purpose,
      expiresInSeconds: OTP_TTL_MS / 1000,
      cooldownSeconds: OTP_COOLDOWN_MS / 1000,
      ...(this.isDev && code ? { devOtp: code } : {}),
    };
  }

  private get isDev() {
    return this.config.get('NODE_ENV') !== 'production';
  }

  private async issueSession(
    userId: string,
    email: string,
    role: string,
    response: Response,
  ) {
    const accessToken = await this.jwt.signAsync({ sub: userId, email, role });
    const refreshToken = randomBytes(48).toString('hex');
    const refreshDays = 7;

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
      },
    });

    response.cookie(ACCESS_COOKIE, accessToken, this.cookieOptions(15 * 60 * 1000, '/api'));
    response.cookie(
      REFRESH_COOKIE,
      refreshToken,
      this.cookieOptions(refreshDays * 24 * 60 * 60 * 1000, '/api/auth'),
    );
  }

  private cookieOptions(maxAge: number, path: string): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE') === 'true',
      sameSite: 'lax',
      path,
      maxAge,
    };
  }

  private clearCookies(response: Response) {
    const base = {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE') === 'true',
      sameSite: 'lax' as const,
    };
    response.clearCookie(ACCESS_COOKIE, { ...base, path: '/api' });
    response.clearCookie(REFRESH_COOKIE, { ...base, path: '/api/auth' });
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private hashOtp(email: string, purpose: OtpPurpose, code: string) {
    return createHash('sha256').update(`${email}:${purpose}:${code}`).digest('hex');
  }

  private normalizeEmail(email: string) {
    return email.toLowerCase().trim();
  }

  private isUniqueConstraint(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    );
  }

  private safeUser(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: string;
    isActive: boolean;
    emailVerifiedAt?: Date | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt ?? null,
      createdAt: user.createdAt,
    };
  }
}

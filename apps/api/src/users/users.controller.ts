import { Body, Controller, Get, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { ResendEmailChangeDto } from './dto/resend-email-change.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.id, dto);
  }

  @Patch('me/password')
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.users.changePassword(user.id, dto, response);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('me/email')
  requestEmailChange(@CurrentUser() user: AuthUser, @Body() dto: RequestEmailChangeDto) {
    return this.users.requestEmailChange(user.id, dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('me/email/resend')
  resendEmailChange(@CurrentUser() user: AuthUser, @Body() dto: ResendEmailChangeDto) {
    return this.users.resendEmailChange(user.id, dto);
  }

  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  @Post('me/email/verify')
  verifyEmailChange(
    @CurrentUser() user: AuthUser,
    @Body() dto: VerifyEmailChangeDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.users.confirmEmailChange(user.id, dto, response);
  }
}

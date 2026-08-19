import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { OtpPurposeDto } from './otp-purpose.dto';

export class VerifyOtpDto extends OtpPurposeDto {
  @ApiProperty({ example: '482913' })
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit code' })
  code!: string;
}

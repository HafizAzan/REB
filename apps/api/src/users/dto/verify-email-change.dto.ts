import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class VerifyEmailChangeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '482913' })
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit code' })
  code!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class OtpPurposeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: OtpPurpose })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}

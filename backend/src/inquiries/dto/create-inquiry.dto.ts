import { IsDateString, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateInquiryDto {
  @IsUUID()
  propertyId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsDateString()
  preferredVisitDate?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;
}

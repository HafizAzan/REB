import { VisitStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVisitStatusDto {
  @IsEnum(VisitStatus)
  status!: VisitStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

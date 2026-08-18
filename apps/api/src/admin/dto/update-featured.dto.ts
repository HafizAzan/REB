import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFeaturedDto {
  @Type(() => Boolean)
  @IsBoolean()
  featured!: boolean;
}

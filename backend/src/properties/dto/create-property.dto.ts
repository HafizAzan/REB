import {
  IsArray,
  IsEnum,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AreaUnit,
  ConstructionStatus,
  FurnishedStatus,
  ListingType,
  PropertyType,
} from '@prisma/client';

export class PropertyMediaDto {
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  publicId?: string;

  @IsOptional()
  @IsIn(['IMAGE', 'VIDEO'])
  kind?: 'IMAGE' | 'VIDEO';
}

export class CreatePropertyDto {
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(40)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsEnum(PropertyType)
  propertyType!: PropertyType;

  @IsEnum(ListingType)
  listingType!: ListingType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area!: number;

  @IsOptional()
  @IsEnum(AreaUnit)
  areaUnit?: AreaUnit;

  @IsOptional()
  @IsEnum(FurnishedStatus)
  furnishedStatus?: FurnishedStatus;

  @IsOptional()
  @IsEnum(ConstructionStatus)
  constructionStatus?: ConstructionStatus;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsOptional()
  @IsString()
  country?: string;

  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenityIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  videoUrls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyMediaDto)
  media?: PropertyMediaDto[];
}

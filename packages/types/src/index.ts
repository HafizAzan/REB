export type Role = 'USER' | 'AGENT' | 'ADMIN';

export type PropertyType =
  | 'HOUSE'
  | 'APARTMENT'
  | 'VILLA'
  | 'CONDO'
  | 'TOWNHOUSE'
  | 'LAND'
  | 'COMMERCIAL'
  | 'OFFICE'
  | 'PENTHOUSE';

export type ListingType = 'SALE' | 'RENT';

export type ConstructionStatus = 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION';

export type FurnishedStatus = 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'SOLD'
  | 'RENTED'
  | 'ARCHIVED';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';

export type VisitStatus = 'REQUESTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type AreaUnit = 'SQFT' | 'SQM' | 'MARLA' | 'KANAL';

export type SortField = 'createdAt' | 'price' | 'area';
export type SortOrder = 'asc' | 'desc';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type OtpPurpose = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface PropertySearchParams {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  propertyType?: PropertyType;
  listingType?: ListingType;
  furnishedStatus?: FurnishedStatus;
  constructionStatus?: ConstructionStatus;
  featured?: boolean;
  amenities?: string;
  page?: number;
  limit?: number;
  sort?: SortField;
  order?: SortOrder;
}

export const PROPERTY_TYPES: PropertyType[] = [
  'HOUSE',
  'APARTMENT',
  'VILLA',
  'CONDO',
  'TOWNHOUSE',
  'LAND',
  'COMMERCIAL',
  'OFFICE',
  'PENTHOUSE',
];

export const LISTING_TYPES: ListingType[] = ['SALE', 'RENT'];

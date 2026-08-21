export type MediaKind = 'IMAGE' | 'VIDEO';

export interface PropertyImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  kind?: MediaKind;
  publicId?: string | null;
}

export interface PropertyMedia {
  url: string;
  publicId?: string;
  kind: MediaKind;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  avatar: string | null;
  agentProfile: { agencyName: string | null; experienceYears: number } | null;
}

export type ListingType = 'SALE' | 'RENT';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  furnishedStatus: string;
  constructionStatus: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  status?: string;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  agent: PropertyAgent;
}

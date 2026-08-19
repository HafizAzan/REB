import type { ListingType } from '@estatex/types';

export interface AdminStats {
  users: number;
  agents: number;
  properties: number;
  published: number;
  pending: number;
  featured: number;
  suspended: number;
  inquiries: number;
  visits: number;
  listingsByStatus: Record<string, number>;
  usersByRole: Record<string, number>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminProperty {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  city: string;
  price: number;
  listingType: ListingType;
  agent: { name: string };
}

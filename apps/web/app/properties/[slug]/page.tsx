import { PropertyDetails } from '@/components/property/property-details';
import { apiGet } from '@/lib/api';
import type { Property } from '@/types/property';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadProperty(slug: string) {
  try {
    return await apiGet<Property>(`/properties/${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await loadProperty(slug);
  if (!property) return { title: 'Property' };
  return {
    title: `${property.title} in ${property.city}`,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  return <PropertyDetails slug={slug} />;
}

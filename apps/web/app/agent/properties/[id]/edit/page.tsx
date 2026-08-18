'use client';

import { useEffect, useState } from 'react';
import { PropertyForm } from '@/components/property/property-form';
import { apiGet } from '@/lib/api';
import type { Property } from '@/types/property';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    void params.then(async ({ id }) => {
      const listings = await apiGet<Property[]>('/properties/mine');
      setProperty(listings.find((item) => item.id === id) ?? null);
    });
  }, [params]);

  if (!property) {
    return <p className="px-4 py-20 text-center text-ink-soft">Loading listing…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Agent</p>
      <h1 className="mt-2 font-display text-4xl">Edit listing</h1>
      <div className="mt-8">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}

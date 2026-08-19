'use client';

import { use } from 'react';
import { PropertyForm } from '@/components/property/property-form';
import { FormSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useMyPropertyQuery } from '@/hooks/use-properties-api';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listingQuery = useMyPropertyQuery(id, true);
  const property = listingQuery.data ?? null;

  if (listingQuery.isPending) {
    return <FormSkeleton />;
  }

  if (!property) {
    return (
      <Typography variant="muted" className="py-10 text-center">
        Listing not found.
      </Typography>
    );
  }

  return (
    <div className="max-w-3xl">
      <Typography variant="heading">Edit listing</Typography>
      <div className="mt-8">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}

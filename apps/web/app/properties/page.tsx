'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PropertyCard } from '@/components/property/property-card';
import { PropertiesBrowserSkeleton, PropertyGridSkeleton } from '@/components/ui/skeleton';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePropertiesQuery } from '@/hooks/use-properties-api';

const FILTER_KEYS = [
  'search',
  'city',
  'propertyType',
  'listingType',
  'bedrooms',
  'minPrice',
  'maxPrice',
  'featured',
  'page',
  'sort',
  'order',
];

function PropertiesBrowser() {
  const searchParams = useSearchParams();
  const query = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) query.set(key, value);
  }
  if (!query.get('limit')) query.set('limit', '12');

  const listQuery = usePropertiesQuery(query.toString());
  const properties = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;
  const currentPage = Number(query.get('page') ?? 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Marketplace</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Find your next address</h1>
      <p className="mt-3 text-ink-soft">
        {meta ? `${meta.total} homes` : 'Search'} · filters live in the URL, so you can share the view.
      </p>

      <form className="mt-8 grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-6">
        <Input name="search" defaultValue={searchParams.get('search') ?? ''} placeholder="Keyword" className="md:col-span-2" />
        <Input name="city" defaultValue={searchParams.get('city') ?? ''} placeholder="City" />
        <Select
          name="propertyType"
          defaultValue={searchParams.get('propertyType') ?? ''}
          placeholder="Any type"
          options={[
            { value: '', label: 'Any type' },
            { value: 'VILLA', label: 'Villa' },
            { value: 'HOUSE', label: 'House' },
            { value: 'APARTMENT', label: 'Apartment' },
            { value: 'PENTHOUSE', label: 'Penthouse' },
            { value: 'CONDO', label: 'Condo' },
            { value: 'OFFICE', label: 'Office' },
          ]}
        />
        <Select
          name="listingType"
          defaultValue={searchParams.get('listingType') ?? ''}
          placeholder="Buy or rent"
          options={[
            { value: '', label: 'Buy or rent' },
            { value: 'SALE', label: 'Buy' },
            { value: 'RENT', label: 'Rent' },
          ]}
        />
        <Button type="submit">Apply</Button>
      </form>

      {listQuery.isPending ? (
        <PropertyGridSkeleton className="mt-10" />
      ) : properties.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-line bg-white py-20 text-center text-ink-soft">
          No properties match these filters yet.
        </div>
      )}

      {meta && meta.totalPages > 1 ? (
        <div className="mt-10 flex justify-center gap-3">
          {currentPage > 1 ? (
            <Link
              href={`/properties?${new URLSearchParams({ ...Object.fromEntries(query), page: String(currentPage - 1) }).toString()}`}
              className="rounded-full border border-line px-4 py-2 text-sm"
            >
              Previous
            </Link>
          ) : null}
          <span className="px-4 py-2 text-sm text-ink-soft">
            Page {meta.page} of {meta.totalPages}
          </span>
          {currentPage < meta.totalPages ? (
            <Link
              href={`/properties?${new URLSearchParams({ ...Object.fromEntries(query), page: String(currentPage + 1) }).toString()}`}
              className="rounded-full border border-line px-4 py-2 text-sm"
            >
              Next
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesBrowserSkeleton />}>
      <PropertiesBrowser />
    </Suspense>
  );
}

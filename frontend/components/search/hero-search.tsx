'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function HeroSearch() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string' && value) params.set(key, value);
    }
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur md:grid-cols-5"
    >
      <Input name="city" placeholder="City or neighbourhood" className="md:col-span-2" />
      <Select
        name="propertyType"
        defaultValue=""
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
        defaultValue="SALE"
        options={[
          { value: 'SALE', label: 'Buy' },
          { value: 'RENT', label: 'Rent' },
        ]}
      />
      <Button type="submit" className="w-full">
        Search properties
      </Button>
    </form>
  );
}

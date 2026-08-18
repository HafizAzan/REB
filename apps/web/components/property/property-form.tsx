'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { apiGet, apiSend } from '@/lib/api';
import type { Property } from '@/types/property';

interface Amenity {
  id: string;
  name: string;
}

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selected, setSelected] = useState<string[]>(property?.amenities.map((item) => item.id) ?? []);

  useEffect(() => {
    apiGet<Amenity[]>('/properties/meta/amenities')
      .then(setAmenities)
      .catch(() => undefined);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const imageUrls = String(form.get('imageUrls') ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      title: form.get('title'),
      description: form.get('description'),
      price: Number(form.get('price')),
      propertyType: form.get('propertyType'),
      listingType: form.get('listingType'),
      bedrooms: Number(form.get('bedrooms')),
      bathrooms: Number(form.get('bathrooms')),
      area: Number(form.get('area')),
      furnishedStatus: form.get('furnishedStatus'),
      constructionStatus: form.get('constructionStatus'),
      address: form.get('address'),
      city: form.get('city'),
      state: form.get('state'),
      latitude: Number(form.get('latitude')),
      longitude: Number(form.get('longitude')),
      amenityIds: selected,
      imageUrls,
    };

    setPending(true);
    try {
      if (property) {
        await apiSend(`/properties/${property.id}`, 'PATCH', payload);
        toast.success('Listing updated');
      } else {
        await apiSend('/properties', 'POST', payload);
        toast.success('Draft created');
      }
      router.push('/agent');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save listing');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="title" required minLength={8} defaultValue={property?.title} placeholder="Title" />
      <textarea
        name="description"
        required
        minLength={40}
        defaultValue={property?.description}
        placeholder="Description (at least 40 characters)"
        className="min-h-32 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="price" type="number" required defaultValue={property?.price} placeholder="Price (PKR)" />
        <Input name="area" type="number" required defaultValue={property?.area} placeholder="Area (sqft)" />
        <Input name="bedrooms" type="number" required defaultValue={property?.bedrooms ?? 0} placeholder="Bedrooms" />
        <Input name="bathrooms" type="number" step="0.5" required defaultValue={property?.bathrooms ?? 0} placeholder="Bathrooms" />
        <Select
          name="propertyType"
          defaultValue={property?.propertyType ?? 'HOUSE'}
          options={[
            { value: 'HOUSE', label: 'House' },
            { value: 'APARTMENT', label: 'Apartment' },
            { value: 'VILLA', label: 'Villa' },
            { value: 'CONDO', label: 'Condo' },
            { value: 'TOWNHOUSE', label: 'Townhouse' },
            { value: 'PENTHOUSE', label: 'Penthouse' },
            { value: 'OFFICE', label: 'Office' },
            { value: 'COMMERCIAL', label: 'Commercial' },
            { value: 'LAND', label: 'Land' },
          ]}
        />
        <Select
          name="listingType"
          defaultValue={property?.listingType ?? 'SALE'}
          options={[
            { value: 'SALE', label: 'Sale' },
            { value: 'RENT', label: 'Rent' },
          ]}
        />
        <Select
          name="furnishedStatus"
          defaultValue={property?.furnishedStatus ?? 'UNFURNISHED'}
          options={[
            { value: 'FURNISHED', label: 'Furnished' },
            { value: 'SEMI_FURNISHED', label: 'Semi furnished' },
            { value: 'UNFURNISHED', label: 'Unfurnished' },
          ]}
        />
        <Select
          name="constructionStatus"
          defaultValue={property?.constructionStatus ?? 'READY_TO_MOVE'}
          options={[
            { value: 'READY_TO_MOVE', label: 'Ready to move' },
            { value: 'UNDER_CONSTRUCTION', label: 'Under construction' },
          ]}
        />
      </div>
      <Input name="address" required defaultValue={property?.address} placeholder="Address" />
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="city" required defaultValue={property?.city} placeholder="City" />
        <Input name="state" required defaultValue={property?.state} placeholder="State" />
        <Input name="latitude" required defaultValue={property?.latitude ?? 24.86} placeholder="Latitude" />
        <Input name="longitude" required defaultValue={property?.longitude ?? 67.0} placeholder="Longitude" />
      </div>
      <textarea
        name="imageUrls"
        defaultValue={property?.images.map((image) => image.url).join('\n')}
        placeholder="Image URLs, one per line (jpeg/png/webp hosted URLs)"
        className="min-h-28 w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-gold"
      />
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity) => {
          const active = selected.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() =>
                setSelected((current) =>
                  active ? current.filter((id) => id !== amenity.id) : [...current, amenity.id],
                )
              }
              className={`rounded-full border px-3 py-1 text-sm ${active ? 'border-ink bg-ink text-paper' : 'border-line'}`}
            >
              {amenity.name}
            </button>
          );
        })}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : property ? 'Save changes' : 'Create draft'}
      </Button>
    </form>
  );
}

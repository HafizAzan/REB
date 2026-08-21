'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Bath, BedDouble, MapPin, Maximize2 } from 'lucide-react';
import { formatArea, formatPrice, prettyEnum } from '@/lib/format';
import { isVideoUrl } from '@/lib/media';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/property/favorite-button';
import { InquiryForm } from '@/components/property/inquiry-form';
import { VisitForm } from '@/components/property/visit-form';
import { PropertyMapLazy } from '@/components/map/property-map-lazy';
import { PropertyDetailsSkeleton } from '@/components/ui/skeleton';
import { usePropertyQuery } from '@/hooks/use-properties-api';

export function PropertyDetails({ slug }: { slug: string }) {
  const propertyQuery = usePropertyQuery(slug);

  if (propertyQuery.isPending) {
    return <PropertyDetailsSkeleton />;
  }

  const property = propertyQuery.data;
  if (!property) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Listing not found</h1>
        <Link href="/properties" className="mt-4 inline-block underline">
          Browse properties
        </Link>
      </div>
    );
  }

  const photos = property.images.filter((item) => !isVideoUrl(item.url, item.kind));
  const videos = property.images.filter((item) => isVideoUrl(item.url, item.kind));
  const hero = photos.find((item) => item.isPrimary) ?? photos[0];

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-ink-soft">
        <Link href="/">Home</Link>
        <span className="px-2">/</span>
        <Link href="/properties">Properties</Link>
        <span className="px-2">/</span>
        <span className="text-ink">{property.title}</span>
      </nav>

      <header className="mt-6 flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{prettyEnum(property.propertyType)}</Badge>
            <Badge>{prettyEnum(property.listingType)}</Badge>
            {property.featured ? <Badge className="bg-gold text-ink">Featured</Badge> : null}
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-ink-soft">
            <MapPin className="h-4 w-4" />
            {property.address}, {property.city}
          </p>
          <p className="mt-4 font-display text-3xl text-gold-dark">
            {formatPrice(property.price, property.listingType)}
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <FavoriteButton propertyId={property.id} className="static" />
        </div>
      </header>

      {hero ? (
        <div className="mt-8 overflow-hidden rounded-[1.75rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.url} alt={property.title} className="h-[460px] w-full object-cover" />
        </div>
      ) : null}

      {photos.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {photos.slice(1, 4).map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.id}
              src={image.url}
              alt={image.altText ?? property.title}
              className="h-32 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      ) : null}

      {videos.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {videos.map((video) => (
            <video
              key={video.id}
              src={video.url}
              controls
              className="h-64 w-full rounded-2xl bg-ink object-cover"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {property.bedrooms > 0 ? (
          <Stat icon={<BedDouble className="h-5 w-5" />} label={`${property.bedrooms} bedrooms`} />
        ) : null}
        {property.bathrooms > 0 ? (
          <Stat icon={<Bath className="h-5 w-5" />} label={`${property.bathrooms} bathrooms`} />
        ) : null}
        <Stat icon={<Maximize2 className="h-5 w-5" />} label={formatArea(property.area, property.areaUnit)} />
      </div>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl">About this home</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">{property.description}</p>

          <h3 className="mt-10 font-display text-2xl">Amenities</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {property.amenities.map((amenity) => (
              <li key={amenity.id} className="rounded-xl border border-line bg-white px-4 py-3 text-sm">
                {amenity.name}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-display text-2xl">Location</h3>
          <p className="mt-2 text-sm text-ink-soft">Approximate neighbourhood pin — not the exact door.</p>
          <div className="mt-4">
            <PropertyMapLazy
              latitude={property.latitude}
              longitude={property.longitude}
              title={property.title}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="h-fit rounded-2xl border border-line bg-white p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-gold-dark">Listed by</p>
            <p className="mt-2 font-display text-2xl">{property.agent.name}</p>
            <p className="text-sm text-ink-soft">{property.agent.agentProfile?.agencyName}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {property.agent.agentProfile?.experienceYears} years of experience
            </p>
            <Link href={`/agents/${property.agent.id}`} className="mt-4 inline-block text-sm underline">
              View agent profile
            </Link>
          </div>
          <InquiryForm propertyId={property.id} />
          <VisitForm propertyId={property.id} />
        </aside>
      </section>
    </article>
  );
}

function Stat({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 text-sm">
      {icon}
      {label}
    </div>
  );
}

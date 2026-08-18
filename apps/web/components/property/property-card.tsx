import Link from 'next/link';
import { formatArea, formatPrice, prettyEnum } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/property/favorite-button';
import { Bath, BedDouble, MapPin, Maximize2 } from 'lucide-react';

export function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const image = property.images.find((item) => item.isPrimary) ?? property.images[0];

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_30px_rgba(22,21,19,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,21,19,0.08)]',
        className,
      )}
    >
      <Link href={`/properties/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.altText ?? property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-cream text-ink-soft">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-white/90 text-ink backdrop-blur">
            {prettyEnum(property.propertyType)}
          </Badge>
          {property.featured ? (
            <Badge className="bg-gold text-ink">Featured</Badge>
          ) : null}
        </div>
        <FavoriteButton propertyId={property.id} />
      </Link>
      <div className="space-y-3 p-5">
        <p className="font-display text-xl text-gold-dark">{formatPrice(property.price, property.listingType)}</p>
        <h3 className="font-display text-[1.35rem] leading-snug text-ink">
          <Link href={`/properties/${property.slug}`} className="hover:text-gold-dark">
            {property.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="h-4 w-4" />
          {property.city}, {property.state}
        </p>
        <div className="flex flex-wrap gap-4 border-t border-line pt-3 text-sm text-ink-soft">
          {property.bedrooms > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" /> {property.bedrooms} Beds
            </span>
          ) : null}
          {property.bathrooms > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms} Baths
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4" /> {formatArea(property.area, property.areaUnit)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="text-ink-soft">{property.agent.name}</span>
          <Link href={`/properties/${property.slug}`} className="font-medium text-ink hover:text-gold-dark">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

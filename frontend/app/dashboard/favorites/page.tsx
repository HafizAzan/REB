'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { PropertyCard } from '@/components/property/property-card';
import { Pagination } from '@/components/ui/pagination';
import { PropertyGridSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useFavoritesQuery } from '@/hooks/use-favorites-api';

function FavoritesBrowser() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '9' }).toString();
  const favoritesQuery = useFavoritesQuery(query, Boolean(user));
  const favorites = favoritesQuery.data?.data ?? [];
  const meta = favoritesQuery.data?.meta;

  return (
    <section>
      <Typography variant="heading">Favorites</Typography>
      <Typography variant="muted" className="mt-2">
        Homes you saved from the marketplace.
      </Typography>
      {favoritesQuery.isPending ? (
        <PropertyGridSkeleton className="mt-6" count={3} />
      ) : favorites.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {favorites.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-ink-soft">Save homes from the marketplace to see them here.</p>
      )}
      {meta && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefForPage={(nextPage) => `/dashboard/favorites?page=${nextPage}`}
        />
      ) : null}
    </section>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={<PropertyGridSkeleton className="mt-6" count={3} />}>
      <FavoritesBrowser />
    </Suspense>
  );
}

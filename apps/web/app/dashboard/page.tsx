'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardSkeleton, ListRowsSkeleton, PropertyGridSkeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAuth } from '@/components/auth/auth-provider';
import { PropertyCard } from '@/components/property/property-card';
import { useFavoritesQuery } from '@/hooks/use-favorites-api';
import { useMyInquiriesQuery } from '@/hooks/use-inquiries-api';
import { useMyVisitsQuery, useUpdateVisitStatusMutation } from '@/hooks/use-visits-api';
import { prettyEnum } from '@/lib/format';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const enabled = Boolean(user);
  const favoritesQuery = useFavoritesQuery(enabled);
  const inquiriesQuery = useMyInquiriesQuery(enabled);
  const visitsQuery = useMyVisitsQuery(enabled);
  const updateVisit = useUpdateVisitStatusMutation();
  const [cancelVisit, setCancelVisit] = useState<{ id: string; title: string } | null>(null);

  const favorites = favoritesQuery.data ?? [];
  const inquiries = inquiriesQuery.data ?? [];
  const visits = visitsQuery.data ?? [];

  if (loading) return <DashboardSkeleton />;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Sign in to continue</h1>
        <Link href="/login" className="mt-4 inline-block underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Buyer</p>
      <h1 className="mt-2 font-display text-5xl">Hello, {user.name.split(' ')[0]}</h1>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Favorites</h2>
        {favoritesQuery.isPending ? (
          <PropertyGridSkeleton className="mt-6" count={3} />
        ) : favorites.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink-soft">Save homes from the marketplace to see them here.</p>
        )}
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Inquiries</h2>
          {inquiriesQuery.isPending ? (
            <ListRowsSkeleton className="mt-4" />
          ) : (
            <ul className="mt-4 space-y-3">
              {inquiries.map((item) => (
                <li key={item.id} className="rounded-2xl border border-line bg-white p-4">
                  <Link href={`/properties/${item.property.slug}`} className="font-medium">
                    {item.property.title}
                  </Link>
                  <p className="text-sm text-ink-soft">{prettyEnum(item.status)}</p>
                  <p className="mt-2 text-sm">{item.message}</p>
                </li>
              ))}
              {!inquiries.length ? <p className="text-ink-soft">No inquiries yet.</p> : null}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-display text-3xl">Visits</h2>
          {visitsQuery.isPending ? (
            <ListRowsSkeleton className="mt-4" />
          ) : (
            <ul className="mt-4 space-y-3">
              {visits.map((item) => (
                <li key={item.id} className="rounded-2xl border border-line bg-white p-4">
                  <Link href={`/properties/${item.property.slug}`} className="font-medium">
                    {item.property.title}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {prettyEnum(item.status)} · {new Date(item.scheduledAt).toLocaleString()}
                  </p>
                  {item.status === 'REQUESTED' || item.status === 'CONFIRMED' ? (
                    <button
                      type="button"
                      className="mt-2 text-sm underline disabled:opacity-50"
                      disabled={updateVisit.isPending}
                      onClick={() => setCancelVisit({ id: item.id, title: item.property.title })}
                    >
                      Cancel
                    </button>
                  ) : null}
                </li>
              ))}
              {!visits.length ? <p className="text-ink-soft">No visits scheduled.</p> : null}
            </ul>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(cancelVisit)}
        title="Cancel this visit?"
        description={`The visit for “${cancelVisit?.title ?? 'this listing'}” will be cancelled.`}
        confirmLabel="Cancel visit"
        danger
        loading={updateVisit.isPending}
        onClose={() => setCancelVisit(null)}
        onConfirm={() => {
          if (!cancelVisit) return;
          updateVisit.mutate(
            { id: cancelVisit.id, status: 'CANCELLED' },
            {
              onSuccess: () => {
                toast.success('Visit cancelled');
                setCancelVisit(null);
              },
              onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
            },
          );
        }}
      />
    </div>
  );
}

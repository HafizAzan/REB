'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { PropertyCard } from '@/components/property/property-card';
import { apiGet, apiSend } from '@/lib/api';
import { prettyEnum } from '@/lib/format';
import type { Property } from '@/types/property';

interface InquiryRow {
  id: string;
  status: string;
  message: string;
  createdAt: string;
  property: { title: string; slug: string; city: string };
}

interface VisitRow {
  id: string;
  status: string;
  scheduledAt: string;
  property: { title: string; slug: string; city: string };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [visits, setVisits] = useState<VisitRow[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiGet<Property[]>('/favorites'),
      apiGet<InquiryRow[]>('/inquiries/my'),
      apiGet<VisitRow[]>('/visits/my'),
    ])
      .then(([saved, myInquiries, myVisits]) => {
        setFavorites(saved);
        setInquiries(myInquiries);
        setVisits(myVisits);
      })
      .catch(() => undefined);
  }, [user]);

  if (loading) return <p className="px-4 py-20 text-center text-ink-soft">Loading…</p>;
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
        {favorites.length ? (
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
        </div>
        <div>
          <h2 className="font-display text-3xl">Visits</h2>
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
                    className="mt-2 text-sm underline"
                    onClick={async () => {
                      await apiSend(`/visits/${item.id}/status`, 'PATCH', { status: 'CANCELLED' });
                      setVisits((current) =>
                        current.map((row) =>
                          row.id === item.id ? { ...row, status: 'CANCELLED' } : row,
                        ),
                      );
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </li>
            ))}
            {!visits.length ? <p className="text-ink-soft">No visits scheduled.</p> : null}
          </ul>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { GroupedBarChart, StatusBars } from '@/components/ui/data-table';
import { StatsGridSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useBuyerDashboardQuery } from '@/hooks/use-dashboard-api';
import { prettyEnum } from '@/lib/format';

const cards = [
  { key: 'favorites', label: 'Favorites', href: '/dashboard/favorites' },
  { key: 'inquiries', label: 'Inquiries', href: '/dashboard/inquiries' },
  { key: 'visits', label: 'Visits', href: '/dashboard/visits' },
] as const;

function prettyMap(items: Record<string, number>) {
  return Object.fromEntries(Object.entries(items).map(([key, value]) => [prettyEnum(key), value]));
}

export default function BuyerAnalyticsPage() {
  const { user } = useAuth();
  const statsQuery = useBuyerDashboardQuery(Boolean(user));
  const stats = statsQuery.data;

  if (statsQuery.isPending) {
    return <StatsGridSkeleton />;
  }

  if (!stats) {
    return (
      <Typography variant="muted" className="py-16 text-center">
        Analytics could not be loaded.
      </Typography>
    );
  }

  const labels = stats.activity.favorites.map((point) => point.label);

  return (
    <div>
      <Typography variant="heading">Overview</Typography>
      <Typography variant="muted" className="mt-2">
        Your saved homes, inquiries, and viewing activity.
      </Typography>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink/20"
          >
            <Typography variant="caption">{item.label}</Typography>
            <Typography variant="heading" className="mt-2">
              {stats[item.key]}
            </Typography>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <GroupedBarChart
          labels={labels}
          series={[
            {
              name: 'Favorites',
              color: '#b08a55',
              values: stats.activity.favorites.map((point) => point.value),
            },
            {
              name: 'Inquiries',
              color: '#161513',
              values: stats.activity.inquiries.map((point) => point.value),
            },
            {
              name: 'Visits',
              color: '#8c6a3d',
              values: stats.activity.visits.map((point) => point.value),
            },
          ]}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <StatusBars
          title="Inquiries by status"
          items={prettyMap(stats.inquiriesByStatus)}
          total={stats.inquiries}
        />
        <StatusBars
          title="Visits by status"
          items={prettyMap(stats.visitsByStatus)}
          total={stats.visits}
        />
      </div>
    </div>
  );
}

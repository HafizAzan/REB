'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { StatsGridSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useAdminStatsQuery } from '@/hooks/use-admin-api';
import { prettyEnum } from '@/lib/format';

const headline = [
  { key: 'users', label: 'Users' },
  { key: 'agents', label: 'Agents' },
  { key: 'properties', label: 'Listings' },
  { key: 'pending', label: 'Pending review' },
  { key: 'published', label: 'Published' },
  { key: 'featured', label: 'Featured' },
  { key: 'inquiries', label: 'Inquiries' },
  { key: 'visits', label: 'Visits' },
] as const;

function Breakdown({
  title,
  items,
  total,
}: {
  title: string;
  items: Record<string, number>;
  total: number;
}) {
  const rows = Object.entries(items);
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <Typography variant="subheading">{title}</Typography>
      <ul className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <li>
            <Typography variant="muted">No data yet.</Typography>
          </li>
        ) : (
          rows.map(([label, count]) => {
            const width = total > 0 ? Math.max(4, Math.round((count / total) * 100)) : 0;
            return (
              <li key={label}>
                <div className="flex items-center justify-between text-sm">
                  <span>{prettyEnum(label)}</span>
                  <span className="text-ink-soft">{count}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const statsQuery = useAdminStatsQuery(user?.role === 'ADMIN');
  const stats = statsQuery.data;

  if (statsQuery.isLoading) {
    return <StatsGridSkeleton />;
  }

  if (!stats) {
    return (
      <Typography variant="muted" className="py-16 text-center">
        Analytics could not be loaded.
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="heading">Analytics</Typography>
      <Typography variant="muted" className="mt-2">
        Platform activity across listings, accounts, inquiries, and visits.
      </Typography>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {headline.map((item) => (
          <div key={item.key} className="rounded-2xl border border-line bg-white p-4">
            <Typography variant="caption">{item.label}</Typography>
            <Typography variant="heading" className="mt-2">
              {stats[item.key]}
            </Typography>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Breakdown title="Listings by status" items={stats.listingsByStatus} total={stats.properties} />
        <Breakdown title="Users by role" items={stats.usersByRole} total={stats.users} />
      </div>

      {stats.suspended > 0 ? (
        <Typography variant="muted" className="mt-6">
          {stats.suspended} suspended account{stats.suspended === 1 ? '' : 's'} — review on{' '}
          <Link href="/admin/users" className="underline">
            Users
          </Link>
          .
        </Typography>
      ) : null}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useMyVisitsQuery, useUpdateVisitStatusMutation } from '@/hooks/use-visits-api';
import { prettyEnum } from '@/lib/format';
import type { BuyerVisit } from '@/types/visit';

function BuyerVisitsTable() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const visitsQuery = useMyVisitsQuery(query, Boolean(user));
  const updateVisit = useUpdateVisitStatusMutation();
  const [cancelVisit, setCancelVisit] = useState<{ id: string; title: string } | null>(null);
  const visits = visitsQuery.data?.data ?? [];
  const meta = visitsQuery.data?.meta;

  return (
    <section>
      <Typography variant="heading">Visits</Typography>
      <Typography variant="muted" className="mt-2">
        Property viewings you requested with agents.
      </Typography>

      <div className="mt-8">
        <DataTable<BuyerVisit>
          loading={visitsQuery.isPending}
          rows={visits}
          rowKey={(item) => item.id}
          empty="No visits scheduled. Request a viewing from a listing."
          columns={[
            {
              key: 'property',
              header: 'Property',
              render: (item) => (
                <div>
                  <Link href={`/properties/${item.property.slug}`} className="font-medium">
                    {item.property.title}
                  </Link>
                  <Typography variant="caption" className="mt-1 block">
                    {item.property.city}
                  </Typography>
                </div>
              ),
            },
            {
              key: 'when',
              header: 'Scheduled',
              render: (item) => new Date(item.scheduledAt).toLocaleString(),
            },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <Badge>{prettyEnum(item.status)}</Badge>,
            },
            {
              key: 'actions',
              header: '',
              render: (item) =>
                item.status === 'REQUESTED' || item.status === 'CONFIRMED' ? (
                  <button
                    type="button"
                    className="text-sm underline disabled:opacity-50"
                    disabled={updateVisit.isPending}
                    onClick={() => setCancelVisit({ id: item.id, title: item.property.title })}
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-ink-soft">—</span>
                ),
            },
          ]}
        />
      </div>

      {meta && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefForPage={(nextPage) => `/dashboard/visits?page=${nextPage}`}
        />
      ) : null}

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
    </section>
  );
}

export default function BuyerVisitsPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <BuyerVisitsTable />
    </Suspense>
  );
}

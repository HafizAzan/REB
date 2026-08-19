'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { useAgentVisitsQuery, useUpdateVisitStatusMutation } from '@/hooks/use-visits-api';
import { prettyEnum } from '@/lib/format';

const statusOptions = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

function AgentVisitsTable() {
  const { user } = useAuth();
  const enabled = user?.role === 'AGENT' || user?.role === 'ADMIN';
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const listQuery = useAgentVisitsQuery(query, Boolean(enabled));
  const updateVisit = useUpdateVisitStatusMutation();
  const [action, setAction] = useState<{ id: string; title: string; status: string } | null>(null);

  const visits = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  if (listQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div>
      <Typography variant="heading">Visits</Typography>
      <Typography variant="muted" className="mt-2">
        Confirm, complete, or cancel viewing requests.
      </Typography>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Visitor</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No visits yet.
                </td>
              </tr>
            ) : (
              visits.map((item) => (
                <tr key={item.id} className="border-b border-line/70">
                  <td className="px-4 py-3">
                    <Typography className="font-medium">{item.user.name}</Typography>
                    <Typography variant="muted">{item.user.email}</Typography>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/properties/${item.property.slug}`} className="font-medium">
                      {item.property.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{new Date(item.scheduledAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={item.status}
                      onChange={(status) =>
                        setAction({ id: item.id, title: item.property.title, status })
                      }
                      options={statusOptions}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefForPage={(nextPage) => `/agent/visits?page=${nextPage}`}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(action)}
        title="Update visit status?"
        description={`Change the visit for “${action?.title ?? 'this listing'}” to ${prettyEnum(action?.status ?? '')}.`}
        confirmLabel="Update"
        danger={action?.status === 'CANCELLED'}
        loading={updateVisit.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (!action) return;
          updateVisit.mutate(
            { id: action.id, status: action.status },
            {
              onSuccess: () => {
                toast.success('Visit updated');
                setAction(null);
              },
              onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
            },
          );
        }}
      />
    </div>
  );
}

export default function AgentVisitsPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <AgentVisitsTable />
    </Suspense>
  );
}

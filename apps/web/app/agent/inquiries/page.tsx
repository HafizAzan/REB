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
import { useAgentInquiriesQuery, useUpdateInquiryStatusMutation } from '@/hooks/use-inquiries-api';
import { prettyEnum } from '@/lib/format';

const statusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'CLOSED', label: 'Closed' },
];

function AgentInquiriesTable() {
  const { user } = useAuth();
  const enabled = user?.role === 'AGENT' || user?.role === 'ADMIN';
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const listQuery = useAgentInquiriesQuery(query, Boolean(enabled));
  const updateInquiry = useUpdateInquiryStatusMutation();
  const [action, setAction] = useState<{ id: string; title: string; status: string } | null>(null);

  const inquiries = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  if (listQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div>
      <Typography variant="heading">Inquiries</Typography>
      <Typography variant="muted" className="mt-2">
        Follow up with buyers and update the status of each conversation.
      </Typography>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              inquiries.map((item) => (
                <tr key={item.id} className="border-b border-line/70">
                  <td className="px-4 py-3">
                    <Typography className="font-medium">{item.name}</Typography>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/properties/${item.property.slug}`} className="font-medium">
                      {item.property.title}
                    </Link>
                  </td>
                  <td className="max-w-sm px-4 py-3">
                    <Typography variant="muted" className="line-clamp-2">
                      {item.message}
                    </Typography>
                  </td>
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
          hrefForPage={(nextPage) => `/agent/inquiries?page=${nextPage}`}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(action)}
        title="Update inquiry status?"
        description={`Change the inquiry for “${action?.title ?? 'this listing'}” to ${prettyEnum(action?.status ?? '')}.`}
        confirmLabel="Update"
        loading={updateInquiry.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (!action) return;
          updateInquiry.mutate(
            { id: action.id, status: action.status },
            {
              onSuccess: () => {
                toast.success('Inquiry updated');
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

export default function AgentInquiriesPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <AgentInquiriesTable />
    </Suspense>
  );
}

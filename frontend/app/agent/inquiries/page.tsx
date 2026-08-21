'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { useAgentInquiriesQuery, useUpdateInquiryStatusMutation } from '@/hooks/use-inquiries-api';
import { prettyEnum } from '@/lib/format';
import type { AgentInquiry } from '@/types/inquiry';

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

  return (
    <div>
      <Typography variant="heading">Inquiries</Typography>
      <Typography variant="muted" className="mt-2">
        Follow up with buyers and update the status of each conversation.
      </Typography>

      <div className="mt-8">
        <DataTable<AgentInquiry>
          loading={listQuery.isLoading}
          rows={inquiries}
          rowKey={(item) => item.id}
          empty="No inquiries yet."
          columns={[
            {
              key: 'from',
              header: 'From',
              render: (item) => <Typography className="font-medium">{item.name}</Typography>,
            },
            {
              key: 'property',
              header: 'Property',
              render: (item) => (
                <Link href={`/properties/${item.property.slug}`} className="font-medium">
                  {item.property.title}
                </Link>
              ),
            },
            {
              key: 'message',
              header: 'Message',
              className: 'max-w-sm',
              render: (item) => (
                <Typography variant="muted" className="line-clamp-2">
                  {item.message}
                </Typography>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (item) => (
                <Select
                  value={item.status}
                  onChange={(status) =>
                    setAction({ id: item.id, title: item.property.title, status })
                  }
                  options={statusOptions}
                />
              ),
            },
          ]}
        />
      </div>

      {meta && meta.totalPages > 1 ? (
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

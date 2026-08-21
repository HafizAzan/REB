'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Pagination } from '@/components/ui/pagination';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { useMyInquiriesQuery } from '@/hooks/use-inquiries-api';
import { prettyEnum } from '@/lib/format';
import type { BuyerInquiry } from '@/types/inquiry';

function BuyerInquiriesTable() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const inquiriesQuery = useMyInquiriesQuery(query, Boolean(user));
  const inquiries = inquiriesQuery.data?.data ?? [];
  const meta = inquiriesQuery.data?.meta;

  return (
    <section>
      <Typography variant="heading">Inquiries</Typography>
      <Typography variant="muted" className="mt-2">
        Messages you sent to agents about listings.
      </Typography>

      <div className="mt-8">
        <DataTable<BuyerInquiry>
          loading={inquiriesQuery.isPending}
          rows={inquiries}
          rowKey={(item) => item.id}
          empty="No inquiries yet. Open a listing to contact an agent."
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
              render: (item) => <Badge>{prettyEnum(item.status)}</Badge>,
            },
            {
              key: 'date',
              header: 'Sent',
              render: (item) =>
                item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—',
            },
          ]}
        />
      </div>

      {meta && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefForPage={(nextPage) => `/dashboard/inquiries?page=${nextPage}`}
        />
      ) : null}
    </section>
  );
}

export default function BuyerInquiriesPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <BuyerInquiriesTable />
    </Suspense>
  );
}

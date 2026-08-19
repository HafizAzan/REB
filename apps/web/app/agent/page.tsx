'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Typography } from '@/components/ui/typography';
import {
  useArchivePropertyMutation,
  useMyPropertiesQuery,
  usePublishPropertyMutation,
} from '@/hooks/use-properties-api';
import { formatPrice, prettyEnum } from '@/lib/format';

type ListingAction =
  | { type: 'publish'; id: string; title: string }
  | { type: 'delete'; id: string; title: string };

function AgentListingsTable() {
  const { user } = useAuth();
  const enabled = user?.role === 'AGENT' || user?.role === 'ADMIN';
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const listingsQuery = useMyPropertiesQuery(query, Boolean(enabled));
  const publish = usePublishPropertyMutation();
  const archive = useArchivePropertyMutation();
  const [action, setAction] = useState<ListingAction | null>(null);

  const listings = listingsQuery.data?.data ?? [];
  const meta = listingsQuery.data?.meta;

  if (listingsQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Typography variant="heading">Listings</Typography>
          <Typography variant="muted" className="mt-2">
            Publish drafts, edit details, or remove homes from the marketplace.
          </Typography>
        </div>
        <Link href="/agent/properties/new">
          <Button>Add property</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No listings yet.
                </td>
              </tr>
            ) : (
              listings.map((property) => (
                <tr key={property.id} className="border-b border-line/70">
                  <td className="px-4 py-3">
                    <Link href={`/properties/${property.slug}`} className="font-medium">
                      {property.title}
                    </Link>
                    <Typography variant="muted">{property.city}</Typography>
                  </td>
                  <td className="px-4 py-3">{formatPrice(property.price, property.listingType)}</td>
                  <td className="px-4 py-3">{prettyEnum(property.status ?? 'DRAFT')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconButton
                        label="Edit"
                        href={`/agent/properties/${property.id}/edit`}
                        icon={<Pencil className="h-4 w-4" />}
                      />
                      {property.status !== 'PUBLISHED' && property.status !== 'PENDING_REVIEW' ? (
                        <IconButton
                          label="Publish"
                          icon={<Upload className="h-4 w-4" />}
                          onClick={() =>
                            setAction({ type: 'publish', id: property.id, title: property.title })
                          }
                        />
                      ) : null}
                      <IconButton
                        label="Delete"
                        tone="danger"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() =>
                          setAction({ type: 'delete', id: property.id, title: property.title })
                        }
                      />
                    </div>
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
          hrefForPage={(nextPage) => `/agent?page=${nextPage}`}
        />
      ) : null}

      <ConfirmDialog
        open={action?.type === 'publish'}
        title="Publish this listing?"
        description={`“${action?.title ?? 'This listing'}” will be submitted for review before it goes live.`}
        confirmLabel="Publish"
        loading={publish.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (action?.type !== 'publish') return;
          publish.mutate(action.id, {
            onSuccess: () => {
              toast.success('Submitted for review');
              setAction(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
          });
        }}
      />

      <ConfirmDialog
        open={action?.type === 'delete'}
        title="Delete this listing?"
        description={`“${action?.title ?? 'This listing'}” will be removed from the marketplace. You can still find it in your agent workspace.`}
        confirmLabel="Delete"
        danger
        loading={archive.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (action?.type !== 'delete') return;
          archive.mutate(action.id, {
            onSuccess: () => {
              toast.success('Listing deleted');
              setAction(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
          });
        }}
      />
    </div>
  );
}

export default function AgentListingsPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <AgentListingsTable />
    </Suspense>
  );
}

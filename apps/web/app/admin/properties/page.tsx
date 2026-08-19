'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { Check, Star, Trash2, X } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Typography } from '@/components/ui/typography';
import {
  useAdminPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useToggleFeaturedMutation,
} from '@/hooks/use-admin-api';
import { useArchivePropertyMutation } from '@/hooks/use-properties-api';
import { formatPrice, prettyEnum } from '@/lib/format';

type PropertyAction =
  | { type: 'approve'; id: string; title: string }
  | { type: 'reject'; id: string; title: string }
  | { type: 'feature'; id: string; title: string; featured: boolean }
  | { type: 'delete'; id: string; title: string };

function AdminPropertiesTable() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const listQuery = useAdminPropertiesQuery(query, user?.role === 'ADMIN');
  const approve = useApprovePropertyMutation();
  const reject = useRejectPropertyMutation();
  const toggleFeatured = useToggleFeaturedMutation();
  const archive = useArchivePropertyMutation();
  const [action, setAction] = useState<PropertyAction | null>(null);

  const properties = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  if (listQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div>
      <Typography variant="heading">Properties</Typography>
      <Typography variant="muted" className="mt-2">
        Moderate listings, approve reviews, and toggle featured homes.
      </Typography>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                  No listings yet.
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="border-b border-line/70">
                  <td className="px-4 py-3">
                    <Link href={`/properties/${property.slug}`} className="font-medium">
                      {property.title}
                    </Link>
                    <Typography variant="muted">{property.city}</Typography>
                  </td>
                  <td className="px-4 py-3">{formatPrice(property.price, property.listingType)}</td>
                  <td className="px-4 py-3">{property.agent.name}</td>
                  <td className="px-4 py-3">
                    {prettyEnum(property.status)}
                    {property.featured ? <span className="ml-2 text-ink-soft">· Featured</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconButton
                        label="Approve"
                        icon={<Check className="h-4 w-4" />}
                        onClick={() =>
                          setAction({ type: 'approve', id: property.id, title: property.title })
                        }
                      />
                      <IconButton
                        label="Reject"
                        tone="danger"
                        icon={<X className="h-4 w-4" />}
                        onClick={() =>
                          setAction({ type: 'reject', id: property.id, title: property.title })
                        }
                      />
                      <IconButton
                        label={property.featured ? 'Unfeature' : 'Feature'}
                        icon={<Star className={`h-4 w-4 ${property.featured ? 'fill-current' : ''}`} />}
                        onClick={() =>
                          setAction({
                            type: 'feature',
                            id: property.id,
                            title: property.title,
                            featured: property.featured,
                          })
                        }
                      />
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
          hrefForPage={(nextPage) => `/admin/properties?page=${nextPage}`}
        />
      ) : null}

      <ConfirmDialog
        open={action?.type === 'approve'}
        title="Approve this listing?"
        description={`“${action?.title ?? 'This listing'}” will be published on the marketplace.`}
        confirmLabel="Approve"
        loading={approve.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (action?.type !== 'approve') return;
          approve.mutate(action.id, {
            onSuccess: () => {
              toast.success('Listing approved');
              setAction(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
          });
        }}
      />

      <ConfirmDialog
        open={action?.type === 'reject'}
        title="Reject this listing?"
        description={`“${action?.title ?? 'This listing'}” will be sent back to draft for the agent.`}
        confirmLabel="Reject"
        danger
        loading={reject.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (action?.type !== 'reject') return;
          reject.mutate(action.id, {
            onSuccess: () => {
              toast.success('Listing rejected');
              setAction(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
          });
        }}
      />

      <ConfirmDialog
        open={action?.type === 'feature'}
        title={action && 'featured' in action && action.featured ? 'Remove from featured?' : 'Feature this listing?'}
        description={
          action && 'featured' in action && action.featured
            ? `“${action.title}” will no longer appear in featured homes.`
            : `“${action?.title ?? 'This listing'}” will be highlighted on the marketplace.`
        }
        confirmLabel={action && 'featured' in action && action.featured ? 'Unfeature' : 'Feature'}
        loading={toggleFeatured.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (action?.type !== 'feature') return;
          toggleFeatured.mutate(
            { id: action.id, featured: !action.featured },
            {
              onSuccess: () => {
                toast.success(action.featured ? 'Removed from featured' : 'Listing featured');
                setAction(null);
              },
              onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed'),
            },
          );
        }}
      />

      <ConfirmDialog
        open={action?.type === 'delete'}
        title="Delete this listing?"
        description={`“${action?.title ?? 'This listing'}” will be removed from the public marketplace.`}
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

export default function AdminPropertiesPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <AdminPropertiesTable />
    </Suspense>
  );
}

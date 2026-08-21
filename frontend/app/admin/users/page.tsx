'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { Ban, UserCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { TablePageSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Typography } from '@/components/ui/typography';
import { useAdminUsersQuery, useToggleUserActiveMutation } from '@/hooks/use-admin-api';
import { prettyEnum } from '@/lib/format';

type UserAction = { id: string; name: string; isActive: boolean };

function AdminUsersTable() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '10' }).toString();
  const listQuery = useAdminUsersQuery(query, user?.role === 'ADMIN');
  const toggleUser = useToggleUserActiveMutation();
  const users = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;
  const [action, setAction] = useState<UserAction | null>(null);

  if (listQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div>
      <Typography variant="heading">Users</Typography>
      <Typography variant="muted" className="mt-2">
        Review accounts and suspend or reactivate access.
      </Typography>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id} className="border-b border-line/70">
                  <td className="px-4 py-3">
                    <Typography className="font-medium">{item.name}</Typography>
                    <Typography variant="muted">{item.email}</Typography>
                  </td>
                  <td className="px-4 py-3">{prettyEnum(item.role)}</td>
                  <td className="px-4 py-3">{item.isActive ? 'Active' : 'Suspended'}</td>
                  <td className="px-4 py-3">
                    {item.id === user?.id ? (
                      <span className="text-xs text-ink-soft">You</span>
                    ) : (
                      <IconButton
                        label={item.isActive ? 'Suspend' : 'Activate'}
                        tone={item.isActive ? 'danger' : 'default'}
                        icon={
                          item.isActive ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )
                        }
                        onClick={() =>
                          setAction({ id: item.id, name: item.name, isActive: item.isActive })
                        }
                      />
                    )}
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
          hrefForPage={(nextPage) => `/admin/users?page=${nextPage}`}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(action)}
        title={action?.isActive ? 'Suspend this account?' : 'Activate this account?'}
        description={
          action?.isActive
            ? `“${action.name}” will lose access until you activate the account again.`
            : `“${action?.name ?? 'This user'}” will be able to sign in again.`
        }
        confirmLabel={action?.isActive ? 'Suspend' : 'Activate'}
        danger={Boolean(action?.isActive)}
        loading={toggleUser.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => {
          if (!action) return;
          toggleUser.mutate(
            { id: action.id, isActive: !action.isActive },
            {
              onSuccess: () => {
                toast.success(action.isActive ? 'Account suspended' : 'Account activated');
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

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <AdminUsersTable />
    </Suspense>
  );
}

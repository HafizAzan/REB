'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkspacePageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <WorkspacePageSkeleton />;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Typography variant="title">Admin only</Typography>
        <Link href="/login" className="mt-4 inline-block underline">
          Sign in as admin@estatex.dev
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Typography variant="eyebrow">Admin</Typography>
      <Typography variant="display" className="mt-2">
        Platform
      </Typography>
      <nav className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'rounded-full px-4 py-2.5 text-sm transition',
                active ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-cream hover:text-ink',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10">{children}</div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkspacePageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/favorites', label: 'Favorites' },
  { href: '/dashboard/inquiries', label: 'Inquiries' },
  { href: '/dashboard/visits', label: 'Visits' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <WorkspacePageSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Typography variant="title">Sign in to continue</Typography>
        <Link href="/login" className="mt-4 inline-block underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Typography variant="eyebrow">Buyer</Typography>
      <Typography variant="display" className="mt-2">
        Hello, {user.name.split(' ')[0]}
      </Typography>
      <nav className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active =
            tab.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(tab.href);
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

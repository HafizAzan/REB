'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { WorkspacePageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/agent', label: 'Listings' },
  { href: '/agent/inquiries', label: 'Inquiries' },
  { href: '/agent/visits', label: 'Visits' },
];

export default function AgentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <WorkspacePageSkeleton />;
  }

  if (!user || (user.role !== 'AGENT' && user.role !== 'ADMIN')) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Typography variant="title">Agent access only</Typography>
        <Link href="/login" className="mt-4 inline-block underline">
          Sign in as agent@estatex.dev
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Typography variant="eyebrow">Agent</Typography>
      <Typography variant="display" className="mt-2">
        Workspace
      </Typography>
      <nav className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.href === '/agent' ? pathname === '/agent' : pathname.startsWith(tab.href);
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { SettingsPageSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/settings', label: 'Profile' },
  { href: '/settings/email', label: 'Email' },
  { href: '/settings/password', label: 'Password' },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <SettingsPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Typography variant="title">Sign in to manage your account</Typography>
        <Link href="/login" className="mt-4 inline-block underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Typography variant="eyebrow">Account</Typography>
      <Typography variant="display" className="mt-2">
        Settings
      </Typography>
      <Typography variant="muted" className="mt-2">
        Update your profile, email, and password in separate flows.
      </Typography>
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 lg:flex-col">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
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
        <div className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

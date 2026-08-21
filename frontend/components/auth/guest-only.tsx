'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { AuthPageSkeleton } from '@/components/ui/skeleton';
import { homeForRole } from '@/lib/auth';
import type { GuestOnlyProps } from '@/types/components/guest-only';

export function GuestOnly({ children }: GuestOnlyProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(homeForRole(user.role));
    }
  }, [loading, router, user]);

  if (loading || user) {
    return <AuthPageSkeleton />;
  }

  return children;
}

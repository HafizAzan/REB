'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { GuestOnly } from '@/components/auth/guest-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthPageSkeleton } from '@/components/ui/skeleton';
import { useResetPasswordMutation } from '@/hooks/use-auth-api';
import { clearResetTicket, readResetTicket } from '@/lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetPassword = useResetPasswordMutation();
  const [ticket, setTicket] = useState<ReturnType<typeof readResetTicket>>(null);

  useEffect(() => {
    const stored = readResetTicket();
    if (!stored) {
      toast.error('Verify the email code before choosing a new password');
      router.replace('/forgot-password');
      return;
    }
    setTicket(stored);
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ticket) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email: ticket.email,
        resetToken: ticket.resetToken,
        password,
      });
      clearResetTicket();
      toast.success('Password updated. Sign in with your new password.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reset password');
    }
  }

  if (!ticket) {
    return (
      <GuestOnly>
        <AuthPageSkeleton />
      </GuestOnly>
    );
  }

  return (
    <GuestOnly>
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
      description={`Updating password for ${ticket.email}`}
      footer={
        <p>
          <Link href="/login" className="text-ink underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="New password (min 8 characters)"
          autoComplete="new-password"
        />
        <Input
          name="confirm"
          type="password"
          required
          minLength={8}
          placeholder="Confirm new password"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth loading={resetPassword.isPending}>
          {resetPassword.isPending ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
    </GuestOnly>
  );
}

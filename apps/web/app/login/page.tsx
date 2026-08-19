'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { useAuth } from '@/components/auth/auth-provider';
import { GuestOnly } from '@/components/auth/guest-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/hooks/use-auth-api';
import { homeForRole, rememberDevOtp } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const login = useLoginMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await login.mutateAsync({
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
      });
      if (result.next === 'verify_email') {
        rememberDevOtp(result.devOtp);
        toast.message('Check your email for a verification code');
        router.push(`/verify-otp?email=${encodeURIComponent(result.email)}&purpose=LOGIN`);
        return;
      }
      await refresh();
      toast.success('Welcome back');
      router.push(homeForRole(result.user.role));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    }
  }

  return (
    <GuestOnly>
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Demo: user@estatex.dev / Password123!"
      footer={
        <p>
          New here?{' '}
          <Link href="/register" className="text-ink underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="email" type="email" required placeholder="Email" autoComplete="email" />
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-ink-soft underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
    </GuestOnly>
  );
}

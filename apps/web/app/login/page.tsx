'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { homeForRole, type AuthUser } from '@/lib/auth';
import { useAuth } from '@/components/auth/auth-provider';
import { apiSend } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const user = await apiSend<AuthUser>('/auth/login', 'POST', {
        email: form.get('email'),
        password: form.get('password'),
      });
      await refresh();
      toast.success('Welcome back');
      router.push(homeForRole(user.role));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Welcome back</p>
      <h1 className="mt-2 font-display text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-soft">Demo: user@estatex.dev / Password123!</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input name="email" type="email" required placeholder="Email" autoComplete="email" />
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        New here?{' '}
        <Link href="/register" className="text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

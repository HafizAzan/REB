'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/auth-provider';
import { homeForRole, type AuthUser } from '@/lib/auth';
import { apiSend } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const user = await apiSend<AuthUser>('/auth/register', 'POST', {
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone') || undefined,
        password: form.get('password'),
      });
      await refresh();
      toast.success('Account created');
      router.push(homeForRole(user.role));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to register');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Start here</p>
      <h1 className="mt-2 font-display text-4xl">Create an account</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input name="name" required placeholder="Full name" autoComplete="name" />
        <Input name="email" type="email" required placeholder="Email" autoComplete="email" />
        <Input name="phone" placeholder="Phone (optional)" autoComplete="tel" />
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Creating…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        Already registered?{' '}
        <Link href="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

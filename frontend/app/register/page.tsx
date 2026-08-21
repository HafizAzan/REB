'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { GuestOnly } from '@/components/auth/guest-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/hooks/use-auth-api';
import { rememberDevOtp } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegisterMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const issued = await register.mutateAsync({
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? '') || undefined,
        password,
      });
      rememberDevOtp(issued.devOtp);
      toast.success('We sent a 6-digit code to your email');
      router.push(`/verify-otp?email=${encodeURIComponent(issued.email)}&purpose=REGISTER`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to register');
    }
  }

  return (
    <GuestOnly>
    <AuthShell
      eyebrow="Start here"
      title="Create an account"
      description="We’ll email you a one-time code before your account goes live."
      footer={
        <p>
          Already registered?{' '}
          <Link href="/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
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
        <Input
          name="confirm"
          type="password"
          required
          minLength={8}
          placeholder="Confirm password"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth loading={register.isPending}>
          {register.isPending ? 'Sending code…' : 'Continue'}
        </Button>
      </form>
    </AuthShell>
    </GuestOnly>
  );
}

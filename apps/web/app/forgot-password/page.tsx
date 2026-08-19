'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { GuestOnly } from '@/components/auth/guest-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPasswordMutation } from '@/hooks/use-auth-api';
import { rememberDevOtp } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPasswordMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const issued = await forgotPassword.mutateAsync({
        email: String(form.get('email') ?? ''),
      });
      rememberDevOtp(issued.devOtp);
      toast.success('If that email exists, we sent a reset code');
      router.push(`/verify-otp?email=${encodeURIComponent(issued.email)}&purpose=RESET_PASSWORD`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send reset code');
    }
  }

  return (
    <GuestOnly>
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot password"
      description="Enter your email and we’ll send a 6-digit code to reset your password."
      footer={
        <p>
          Remembered it?{' '}
          <Link href="/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="email" type="email" required placeholder="Email" autoComplete="email" />
        <Button type="submit" fullWidth loading={forgotPassword.isPending}>
          {forgotPassword.isPending ? 'Sending code…' : 'Send reset code'}
        </Button>
      </form>
    </AuthShell>
    </GuestOnly>
  );
}

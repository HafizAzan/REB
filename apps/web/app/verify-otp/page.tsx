'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AuthShell } from '@/components/auth/auth-shell';
import { GuestOnly } from '@/components/auth/guest-only';
import { OtpInput } from '@/components/auth/otp-input';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { AuthPageSkeleton } from '@/components/ui/skeleton';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/hooks/use-auth-api';
import { homeForRole, readDevOtp, rememberDevOtp, rememberResetTicket } from '@/lib/auth';
import type { OtpPurpose } from '@/types/auth';

const PURPOSES: OtpPurpose[] = ['REGISTER', 'LOGIN', 'RESET_PASSWORD'];

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const verifyOtp = useVerifyOtpMutation();
  const resendOtp = useResendOtpMutation();
  const [code, setCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const email = searchParams.get('email') ?? '';
  const purposeParam = searchParams.get('purpose') ?? 'REGISTER';
  const purpose = PURPOSES.includes(purposeParam as OtpPurpose)
    ? (purposeParam as OtpPurpose)
    : 'REGISTER';

  useEffect(() => {
    setDevOtp(readDevOtp());
  }, []);

  const copy = useMemo(() => {
    if (purpose === 'RESET_PASSWORD') {
      return {
        eyebrow: 'Reset password',
        title: 'Enter the code',
        description: `We sent a 6-digit code to ${email || 'your email'}.`,
      };
    }
    if (purpose === 'LOGIN') {
      return {
        eyebrow: 'Verify email',
        title: 'Confirm it’s you',
        description: `Enter the sign-in code sent to ${email || 'your email'}.`,
      };
    }
    return {
      eyebrow: 'Almost there',
      title: 'Verify your email',
      description: `Enter the code we sent to ${email || 'your email'} to finish creating your account.`,
    };
  }, [email, purpose]);

  async function verify() {
    if (!email) {
      toast.error('Missing email. Start this flow again.');
      return;
    }
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    try {
      const result = await verifyOtp.mutateAsync({ email, purpose, code });
      rememberDevOtp();
      if (result.next === 'reset_password' && result.resetToken) {
        rememberResetTicket(result.email ?? email, result.resetToken);
        toast.success('Code verified. Choose a new password.');
        router.push('/reset-password');
        return;
      }
      await refresh();
      toast.success(purpose === 'REGISTER' ? 'Account verified' : 'Signed in');
      router.push(homeForRole(result.user?.role ?? 'USER'));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to verify code');
    }
  }

  async function resend() {
    if (!email) return;
    try {
      const issued = await resendOtp.mutateAsync({ email, purpose });
      rememberDevOtp(issued.devOtp);
      setDevOtp(issued.devOtp ?? null);
      toast.success('A new code is on its way');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend code');
    }
  }

  return (
    <AuthShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      footer={
        <p>
          Wrong email?{' '}
          <Link
            href={purpose === 'RESET_PASSWORD' ? '/forgot-password' : purpose === 'LOGIN' ? '/login' : '/register'}
            className="text-ink underline"
          >
            Go back
          </Link>
        </p>
      }
    >
      {devOtp ? (
        <p className="mb-4 rounded-xl border border-gold/30 bg-cream px-3 py-2 text-xs text-ink-soft">
          Development code: <span className="font-medium tracking-[0.2em] text-ink">{devOtp}</span>
        </p>
      ) : null}
      <div className="space-y-5">
        <OtpInput value={code} onChange={setCode} disabled={verifyOtp.isPending} />
        <Button
          fullWidth
          loading={verifyOtp.isPending}
          disabled={code.length !== 6}
          onClick={() => void verify()}
        >
          {verifyOtp.isPending ? 'Verifying…' : 'Verify code'}
        </Button>
        <button
          type="button"
          className="w-full text-center text-xs text-ink-soft underline disabled:opacity-50"
          disabled={resendOtp.isPending}
          onClick={() => void resend()}
        >
          {resendOtp.isPending ? 'Resending…' : 'Resend code'}
        </button>
      </div>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <GuestOnly>
      <Suspense
        fallback={<AuthPageSkeleton />}
      >
        <VerifyOtpForm />
      </Suspense>
    </GuestOnly>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { OtpInput } from '@/components/auth/otp-input';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useRequestEmailChangeMutation,
  useResendEmailChangeMutation,
  useVerifyEmailChangeMutation,
} from '@/hooks/use-settings-api';
import { rememberDevOtp } from '@/lib/auth';
import type { OtpIssued } from '@/types/auth';

export default function SettingsEmailPage() {
  const { user, refresh } = useAuth();
  const requestChange = useRequestEmailChangeMutation();
  const verifyChange = useVerifyEmailChangeMutation();
  const resendChange = useResendEmailChangeMutation();
  const [pending, setPending] = useState<OtpIssued | null>(null);
  const [code, setCode] = useState('');

  async function onRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const issued = await requestChange.mutateAsync({
        email: String(form.get('email') ?? ''),
        password: String(form.get('password') ?? ''),
      });
      rememberDevOtp(issued.devOtp);
      setPending(issued);
      setCode('');
      toast.success('We sent a code to the new email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start email change');
    }
  }

  async function onVerify() {
    if (!pending) return;
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    try {
      await verifyChange.mutateAsync({ email: pending.email, code });
      rememberDevOtp();
      setPending(null);
      setCode('');
      await refresh();
      toast.success('Email updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to verify code');
    }
  }

  async function onResend() {
    if (!pending) return;
    try {
      const issued = await resendChange.mutateAsync({ email: pending.email });
      rememberDevOtp(issued.devOtp);
      setPending(issued);
      toast.success('A new code is on its way');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend code');
    }
  }

  if (!user) return null;

  if (pending) {
    return (
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Email</p>
        <h2 className="mt-2 font-display text-3xl">Verify the new address</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Enter the 6-digit code sent to <span className="text-ink">{pending.email}</span>.
        </p>
        {pending.devOtp ? (
          <p className="mt-4 rounded-xl border border-gold/30 bg-cream px-3 py-2 text-xs text-ink-soft">
            Development code:{' '}
            <span className="font-medium tracking-[0.2em] text-ink">{pending.devOtp}</span>
          </p>
        ) : null}
        <div className="mt-8 max-w-md space-y-5">
          <OtpInput value={code} onChange={setCode} disabled={verifyChange.isPending} />
          <Button
            fullWidth
            loading={verifyChange.isPending}
            disabled={code.length !== 6}
            onClick={() => void onVerify()}
          >
            {verifyChange.isPending ? 'Verifying…' : 'Confirm email'}
          </Button>
          <button
            type="button"
            className="w-full text-center text-xs text-ink-soft underline disabled:opacity-50"
            disabled={resendChange.isPending}
            onClick={() => void onResend()}
          >
            {resendChange.isPending ? 'Resending…' : 'Resend code'}
          </button>
          <button
            type="button"
            className="w-full text-center text-xs text-ink-soft underline"
            onClick={() => {
              setPending(null);
              setCode('');
              rememberDevOtp();
            }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Email</p>
      <h2 className="mt-2 font-display text-3xl">Change email</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Current address: <span className="text-ink">{user.email}</span>. We’ll send a code to the new inbox
        before switching it.
      </p>
      <form onSubmit={onRequest} className="mt-8 max-w-md space-y-4">
        <label className="block text-sm text-ink-soft">
          New email
          <Input name="email" type="email" required className="mt-1.5" autoComplete="email" />
        </label>
        <label className="block text-sm text-ink-soft">
          Current password
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1.5"
            autoComplete="current-password"
          />
        </label>
        <Button type="submit" loading={requestChange.isPending}>
          {requestChange.isPending ? 'Sending code…' : 'Send verification code'}
        </Button>
      </form>
    </div>
  );
}

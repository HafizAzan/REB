'use client';

import { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChangePasswordMutation } from '@/hooks/use-settings-api';

export default function SettingsPasswordPage() {
  const changePassword = useChangePasswordMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPassword = String(data.get('newPassword') ?? '');
    const confirm = String(data.get('confirm') ?? '');
    if (newPassword !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: String(data.get('currentPassword') ?? ''),
        newPassword,
      });
      form.reset();
      toast.success('Password updated. Other sessions have been signed out.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update password');
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Password</p>
      <h2 className="mt-2 font-display text-3xl">Change password</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Enter your current password, then choose a new one. We’ll refresh this session and sign out everywhere else.
      </p>
      <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
        <label className="block text-sm text-ink-soft">
          Current password
          <Input
            name="currentPassword"
            type="password"
            required
            minLength={8}
            className="mt-1.5"
            autoComplete="current-password"
          />
        </label>
        <label className="block text-sm text-ink-soft">
          New password
          <Input
            name="newPassword"
            type="password"
            required
            minLength={8}
            className="mt-1.5"
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm text-ink-soft">
          Confirm new password
          <Input
            name="confirm"
            type="password"
            required
            minLength={8}
            className="mt-1.5"
            autoComplete="new-password"
          />
        </label>
        <Button type="submit" loading={changePassword.isPending}>
          {changePassword.isPending ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}

'use client';

import { FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useUpdateProfileMutation } from '@/hooks/use-settings-api';

export default function SettingsProfilePage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfileMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = new FormData(event.currentTarget);
    try {
      await updateProfile.mutateAsync({
        name: String(form.get('name') ?? '').trim(),
        phone: String(form.get('phone') ?? '').trim() || undefined,
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update profile');
    }
  }

  if (!user) return null;

  return (
    <div>
      <Typography variant="eyebrow">Profile</Typography>
      <Typography variant="heading" className="mt-2">
        Your details
      </Typography>
      <Typography variant="muted" className="mt-2">
        Name and phone are public to agents when you enquire.
      </Typography>
      <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
        <label className="block text-sm text-ink-soft">
          Full name
          <Input name="name" required defaultValue={user.name} className="mt-1.5" autoComplete="name" />
        </label>
        <label className="block text-sm text-ink-soft">
          Phone
          <Input name="phone" defaultValue={user.phone ?? ''} className="mt-1.5" autoComplete="tel" />
        </label>
        <Button type="submit" loading={updateProfile.isPending}>
          {updateProfile.isPending ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </div>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiSend } from '@/lib/api';

export function VisitForm({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      await apiSend('/visits', 'POST', {
        propertyId,
        scheduledAt: new Date(String(form.get('scheduledAt'))).toISOString(),
        notes: form.get('notes') || undefined,
      });
      toast.success('Visit requested');
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not request visit');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-line bg-cream/70 p-6">
      <h3 className="font-display text-2xl">Schedule a visit</h3>
      <Input name="scheduledAt" type="datetime-local" required />
      <Input name="notes" placeholder="Anything the agent should know?" />
      <Button type="submit" variant="outline" className="w-full" disabled={pending}>
        {pending ? 'Requesting…' : 'Request visit'}
      </Button>
    </form>
  );
}

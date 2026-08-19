'use client';

import { FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateVisitMutation } from '@/hooks/use-visits-api';

export function VisitForm({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const createVisit = useCreateVisitMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await createVisit.mutateAsync({
        propertyId,
        scheduledAt: new Date(String(data.get('scheduledAt'))).toISOString(),
        notes: data.get('notes') || undefined,
      });
      toast.success('Visit requested');
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not request visit');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-line bg-cream/70 p-6">
      <h3 className="font-display text-2xl">Schedule a visit</h3>
      <Input name="scheduledAt" type="datetime-local" required />
      <Input name="notes" placeholder="Anything the agent should know?" />
      <Button type="submit" variant="outline" fullWidth loading={createVisit.isPending}>
        {createVisit.isPending ? 'Requesting…' : 'Request visit'}
      </Button>
    </form>
  );
}

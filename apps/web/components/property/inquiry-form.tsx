'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiSend } from '@/lib/api';

export function InquiryForm({ propertyId }: { propertyId: string }) {
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
      await apiSend('/inquiries', 'POST', {
        propertyId,
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        preferredVisitDate: form.get('preferredVisitDate') || undefined,
        message: form.get('message'),
      });
      toast.success('Inquiry sent to the agent');
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not send inquiry');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-line bg-white p-6">
      <h3 className="font-display text-2xl">Contact agent</h3>
      <Input name="name" required defaultValue={user?.name ?? ''} placeholder="Name" />
      <Input name="email" type="email" required defaultValue={user?.email ?? ''} placeholder="Email" />
      <Input name="phone" required defaultValue={user?.phone ?? ''} placeholder="Phone" />
      <Input name="preferredVisitDate" type="date" />
      <textarea
        name="message"
        required
        minLength={10}
        placeholder="Tell the agent what you’re looking for"
        className="min-h-28 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Sending…' : 'Send inquiry'}
      </Button>
    </form>
  );
}

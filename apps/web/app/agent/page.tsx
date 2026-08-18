'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { apiGet, apiSend } from '@/lib/api';
import { formatPrice, prettyEnum } from '@/lib/format';
import type { Property } from '@/types/property';

interface InquiryRow {
  id: string;
  status: string;
  name: string;
  message: string;
  property: { title: string; slug: string };
}

interface VisitRow {
  id: string;
  status: string;
  scheduledAt: string;
  user: { name: string; email: string };
  property: { title: string; slug: string };
}

export default function AgentDashboardPage() {
  const { user, loading } = useAuth();
  const [listings, setListings] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  async function load() {
    const [mine, agentInquiries, agentVisits] = await Promise.all([
      apiGet<Property[]>('/properties/mine'),
      apiGet<InquiryRow[]>('/inquiries/agent'),
      apiGet<VisitRow[]>('/visits/agent'),
    ]);
    setListings(mine);
    setInquiries(agentInquiries);
    setVisits(agentVisits);
  }

  useEffect(() => {
    if (user?.role === 'AGENT' || user?.role === 'ADMIN') {
      void load().catch((error) => toast.error(error instanceof Error ? error.message : 'Failed to load'));
    }
  }, [user]);

  if (loading) return <p className="px-4 py-20 text-center text-ink-soft">Loading…</p>;
  if (!user || (user.role !== 'AGENT' && user.role !== 'ADMIN')) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Agent access only</h1>
        <Link href="/login" className="mt-4 inline-block underline">
          Sign in as agent@estatex.dev
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Agent</p>
          <h1 className="mt-2 font-display text-5xl">Listings</h1>
        </div>
        <Link href="/agent/properties/new">
          <Button>Add property</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((property) => (
              <tr key={property.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <Link href={`/properties/${property.slug}`} className="font-medium">
                    {property.title}
                  </Link>
                  <p className="text-ink-soft">{property.city}</p>
                </td>
                <td className="px-4 py-3">{formatPrice(property.price, property.listingType)}</td>
                <td className="px-4 py-3">{prettyEnum(property.status ?? 'DRAFT')}</td>
                <td className="px-4 py-3 space-x-3">
                  <Link href={`/agent/properties/${property.id}/edit`} className="underline">
                    Edit
                  </Link>
                  {property.status !== 'PUBLISHED' && property.status !== 'PENDING_REVIEW' ? (
                    <button
                      type="button"
                      className="underline"
                      onClick={async () => {
                        await apiSend(`/properties/${property.id}/publish`, 'POST');
                        toast.success('Submitted for review');
                        await load();
                      }}
                    >
                      Publish
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setArchiveId(property.id)}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl">Inquiries</h2>
          <ul className="mt-4 space-y-3">
            {inquiries.map((item) => (
              <li key={item.id} className="rounded-2xl border border-line bg-white p-4">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-ink-soft">
                  {item.property.title} · {prettyEnum(item.status)}
                </p>
                <p className="mt-2 text-sm">{item.message}</p>
                <Select
                  className="mt-3"
                  value={item.status}
                  onChange={async (status) => {
                    await apiSend(`/inquiries/${item.id}/status`, 'PATCH', { status });
                    await load();
                  }}
                  options={[
                    { value: 'NEW', label: 'New' },
                    { value: 'CONTACTED', label: 'Contacted' },
                    { value: 'IN_PROGRESS', label: 'In progress' },
                    { value: 'CLOSED', label: 'Closed' },
                  ]}
                />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-3xl">Visits</h2>
          <ul className="mt-4 space-y-3">
            {visits.map((item) => (
              <li key={item.id} className="rounded-2xl border border-line bg-white p-4">
                <p className="font-medium">{item.user.name}</p>
                <p className="text-sm text-ink-soft">
                  {item.property.title} · {new Date(item.scheduledAt).toLocaleString()}
                </p>
                <Select
                  className="mt-3"
                  value={item.status}
                  onChange={async (status) => {
                    await apiSend(`/visits/${item.id}/status`, 'PATCH', { status });
                    await load();
                  }}
                  options={[
                    { value: 'REQUESTED', label: 'Requested' },
                    { value: 'CONFIRMED', label: 'Confirmed' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                    { value: 'COMPLETED', label: 'Completed' },
                  ]}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Modal
        open={Boolean(archiveId)}
        onClose={() => setArchiveId(null)}
        title="Archive this listing?"
      >
        <p className="text-sm leading-6 text-ink-soft">
          It will leave the public marketplace. You can still find it in your agent workspace.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setArchiveId(null)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!archiveId) return;
              await apiSend(`/properties/${archiveId}/archive`, 'POST');
              setArchiveId(null);
              await load();
            }}
          >
            Archive
          </Button>
        </div>
      </Modal>
    </div>
  );
}

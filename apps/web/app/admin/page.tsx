'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { apiGet, apiSend } from '@/lib/api';
import { prettyEnum } from '@/lib/format';

interface Stats {
  users: number;
  agents: number;
  properties: number;
  published: number;
  pending: number;
  inquiries: number;
  visits: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AdminProperty {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  city: string;
  agent: { name: string };
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [properties, setProperties] = useState<AdminProperty[]>([]);

  async function load() {
    const [nextStats, nextUsers, nextProperties] = await Promise.all([
      apiGet<Stats>('/admin/stats'),
      apiGet<AdminUser[]>('/admin/users'),
      apiGet<AdminProperty[]>('/admin/properties'),
    ]);
    setStats(nextStats);
    setUsers(nextUsers);
    setProperties(nextProperties);
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      void load().catch((error) => toast.error(error instanceof Error ? error.message : 'Failed'));
    }
  }, [user]);

  if (loading) return <p className="px-4 py-20 text-center text-ink-soft">Loading…</p>;
  if (user?.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Admin only</h1>
        <Link href="/login" className="mt-4 inline-block underline">
          Sign in as admin@estatex.dev
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Admin</p>
      <h1 className="mt-2 font-display text-5xl">Moderation</h1>

      {stats ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs uppercase tracking-widest text-ink-soft">{prettyEnum(key)}</p>
              <p className="mt-2 font-display text-3xl">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <h2 className="mt-12 font-display text-3xl">Properties</h2>
      <div className="mt-4 space-y-3">
        {properties.map((property) => (
          <div key={property.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div>
              <Link href={`/properties/${property.slug}`} className="font-medium">
                {property.title}
              </Link>
              <p className="text-sm text-ink-soft">
                {property.city} · {property.agent.name} · {prettyEnum(property.status)}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                type="button"
                className="underline"
                onClick={async () => {
                  await apiSend(`/admin/properties/${property.id}/approve`, 'POST');
                  await load();
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className="underline"
                onClick={async () => {
                  await apiSend(`/admin/properties/${property.id}/reject`, 'POST');
                  await load();
                }}
              >
                Reject
              </button>
              <button
                type="button"
                className="underline"
                onClick={async () => {
                  await apiSend(`/admin/properties/${property.id}/featured`, 'PATCH', {
                    featured: !property.featured,
                  });
                  await load();
                }}
              >
                {property.featured ? 'Unfeature' : 'Feature'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-3xl">Users</h2>
      <div className="mt-4 space-y-3">
        {users.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-ink-soft">
                {item.email} · {item.role} · {item.isActive ? 'active' : 'suspended'}
              </p>
            </div>
            <button
              type="button"
              className="text-sm underline"
              onClick={async () => {
                await apiSend(`/admin/users/${item.id}`, 'PATCH', { isActive: !item.isActive });
                await load();
              }}
            >
              {item.isActive ? 'Suspend' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

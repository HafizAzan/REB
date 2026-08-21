'use client';

import { use } from 'react';
import Link from 'next/link';
import { PropertyCard } from '@/components/property/property-card';
import { AgentProfileSkeleton, PropertyGridSkeleton } from '@/components/ui/skeleton';
import { useAgentPropertiesQuery, useAgentQuery } from '@/hooks/use-agents-api';

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agentQuery = useAgentQuery(id);
  const listingsQuery = useAgentPropertiesQuery(id);

  if (agentQuery.isPending) {
    return <AgentProfileSkeleton />;
  }

  const agent = agentQuery.data;
  if (!agent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Agent not found</h1>
        <Link href="/agents" className="mt-4 inline-block underline">
          Browse agents
        </Link>
      </div>
    );
  }

  const listings = listingsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Agent</p>
      <h1 className="mt-2 font-display text-5xl">{agent.name}</h1>
      <p className="mt-2 text-gold-dark">{agent.agentProfile?.agencyName}</p>
      <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{agent.agentProfile?.bio}</p>
      <h2 className="mt-12 font-display text-3xl">Listings</h2>
      {listingsQuery.isPending ? (
        <PropertyGridSkeleton className="mt-6" count={4} columns={2} />
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {listings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

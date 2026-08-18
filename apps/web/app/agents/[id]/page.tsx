import { notFound } from 'next/navigation';
import { apiGet, apiList } from '@/lib/api';
import { PropertyCard } from '@/components/property/property-card';
import type { Agent, Property } from '@/types/property';

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let agent: Agent | null = null;
  let listings: Property[] = [];
  try {
    agent = await apiGet<Agent>(`/agents/${id}`);
    const result = await apiList<Property[]>(`/agents/${id}/properties`);
    listings = Array.isArray(result.data) ? result.data : [];
  } catch {
    agent = null;
  }
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Agent</p>
      <h1 className="mt-2 font-display text-5xl">{agent.name}</h1>
      <p className="mt-2 text-gold-dark">{agent.agentProfile?.agencyName}</p>
      <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{agent.agentProfile?.bio}</p>
      <h2 className="mt-12 font-display text-3xl">Listings</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {listings.map((property) => (
          <PropertyCard key={property.id} property={property as Property} />
        ))}
      </div>
    </div>
  );
}

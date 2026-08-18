import Link from 'next/link';
import { apiList } from '@/lib/api';
import type { Agent } from '@/types/property';

export default async function AgentsPage() {
  let agents: Agent[] = [];
  try {
    const result = await apiList<Agent[]>('/agents');
    agents = Array.isArray(result.data) ? result.data : [];
  } catch {
    agents = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Advisors</p>
      <h1 className="mt-2 font-display text-5xl">Agents</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1"
          >
            <p className="font-display text-2xl">{agent.name}</p>
            <p className="mt-1 text-sm text-gold-dark">{agent.agentProfile?.agencyName}</p>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-ink-soft">{agent.agentProfile?.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

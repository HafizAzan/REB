'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AgentGridSkeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { useAgentsQuery } from '@/hooks/use-agents-api';

function AgentsBrowser() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '9' }).toString();
  const agentsQuery = useAgentsQuery(query);
  const agents = agentsQuery.data?.data ?? [];
  const meta = agentsQuery.data?.meta;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Advisors</p>
      <h1 className="mt-2 font-display text-5xl">Agents</h1>
      {meta ? (
        <p className="mt-3 text-ink-soft">{meta.total} advisors on EstateX</p>
      ) : null}
      {agentsQuery.isPending ? (
        <AgentGridSkeleton className="mt-10" />
      ) : agents.length ? (
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
              <p className="mt-4 text-xs uppercase tracking-widest text-ink-soft">
                {agent.agentProfile?.experienceYears} years · {agent._count?.properties ?? 0} listings
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-ink-soft">No agents yet.</p>
      )}
      {meta && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          hrefForPage={(nextPage) => `/agents?page=${nextPage}`}
        />
      ) : null}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <AgentGridSkeleton className="mt-10" />
        </div>
      }
    >
      <AgentsBrowser />
    </Suspense>
  );
}

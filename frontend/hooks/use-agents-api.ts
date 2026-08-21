'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet, apiList } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { Agent } from '@/types/agent';
import type { Property } from '@/types/property';

export function useAgentsQuery(query: string) {
  return useQuery({
    queryKey: queryKeys.agents.list(query),
    queryFn: () => apiList<Agent[]>(`/agents?${query}`),
  });
}

export function useAgentQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.agents.detail(id),
    queryFn: () => apiGet<Agent>(`/agents/${id}`),
    enabled: Boolean(id),
  });
}

export function useAgentPropertiesQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.agents.properties(id),
    queryFn: async () => {
      const result = await apiList<Property[]>(`/agents/${id}/properties`);
      return Array.isArray(result.data) ? result.data : [];
    },
    enabled: Boolean(id),
  });
}

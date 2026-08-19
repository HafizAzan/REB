'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AgentVisit, BuyerVisit } from '@/types/visit';

export function useMyVisitsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.visits.my,
    queryFn: () => apiGet<BuyerVisit[]>('/visits/my'),
    enabled,
  });
}

export function useAgentVisitsQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.visits.agentList(query),
    queryFn: () => apiList<AgentVisit[]>(`/visits/agent?${query}`),
    enabled,
  });
}

export function useCreateVisitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => apiSend('/visits', 'POST', body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.visits.my });
    },
  });
}

export function useUpdateVisitStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiSend(`/visits/${id}/status`, 'PATCH', { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.visits.my }),
        queryClient.invalidateQueries({ queryKey: queryKeys.visits.agent }),
      ]);
    },
  });
}

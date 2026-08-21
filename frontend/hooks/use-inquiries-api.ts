'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AgentInquiry, BuyerInquiry } from '@/types/inquiry';

export function useMyInquiriesQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.inquiries.myList(query),
    queryFn: () => apiList<BuyerInquiry[]>(`/inquiries/my?${query}`),
    enabled,
  });
}

export function useAgentInquiriesQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.inquiries.agentList(query),
    queryFn: () => apiList<AgentInquiry[]>(`/inquiries/agent?${query}`),
    enabled,
  });
}

export function useCreateInquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => apiSend('/inquiries', 'POST', body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.my }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.buyer }),
      ]);
    },
  });
}

export function useUpdateInquiryStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiSend(`/inquiries/${id}/status`, 'PATCH', { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.agent });
    },
  });
}

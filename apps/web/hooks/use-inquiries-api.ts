'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AgentInquiry, BuyerInquiry } from '@/types/inquiry';

export function useMyInquiriesQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.inquiries.my,
    queryFn: () => apiGet<BuyerInquiry[]>('/inquiries/my'),
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
      await queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.my });
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

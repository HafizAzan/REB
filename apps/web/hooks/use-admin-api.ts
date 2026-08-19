'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AdminProperty, AdminStats, AdminUser } from '@/types/admin';

export function useAdminStatsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => apiGet<AdminStats>('/admin/stats'),
    enabled,
  });
}

export function useAdminUsersQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.users(query),
    queryFn: () => apiList<AdminUser[]>(`/admin/users?${query}`),
    enabled,
  });
}

export function useAdminPropertiesQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.properties(query),
    queryFn: () => apiList<AdminProperty[]>(`/admin/properties?${query}`),
    enabled,
  });
}

function useInvalidateAdmin() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
}

export function useApprovePropertyMutation() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/admin/properties/${id}/approve`, 'POST'),
    onSuccess: invalidate,
  });
}

export function useRejectPropertyMutation() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/admin/properties/${id}/reject`, 'POST'),
    onSuccess: invalidate,
  });
}

export function useToggleFeaturedMutation() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      apiSend(`/admin/properties/${id}/featured`, 'PATCH', { featured }),
    onSuccess: invalidate,
  });
}

export function useToggleUserActiveMutation() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiSend(`/admin/users/${id}`, 'PATCH', { isActive }),
    onSuccess: invalidate,
  });
}

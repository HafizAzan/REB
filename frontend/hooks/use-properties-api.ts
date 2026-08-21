'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { Property } from '@/types/property';

export function usePropertiesQuery(query: string) {
  return useQuery({
    queryKey: queryKeys.properties.list(query),
    queryFn: () => apiList<Property[]>(`/properties?${query}`),
  });
}

export function usePropertyQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(slug),
    queryFn: () => apiGet<Property>(`/properties/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useMyPropertiesQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.properties.mineList(query),
    queryFn: () => apiList<Property[]>(`/properties/mine?${query}`),
    enabled,
  });
}

export function useMyPropertyQuery(id: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.properties.mineDetail(id),
    queryFn: () => apiGet<Property>(`/properties/mine/${id}`),
    enabled: enabled && Boolean(id),
  });
}

export function useAmenitiesQuery() {
  return useQuery({
    queryKey: queryKeys.properties.amenities,
    queryFn: () => apiGet<{ id: string; name: string }[]>('/properties/meta/amenities'),
  });
}

export function useSavePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: string;
      payload: Record<string, unknown>;
    }) =>
      id
        ? apiSend<Property>(`/properties/${id}`, 'PATCH', payload)
        : apiSend<Property>('/properties', 'POST', payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function usePublishPropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/properties/${id}/publish`, 'POST'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties.mine });
    },
  });
}

export function useArchivePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiSend(`/properties/${id}/archive`, 'POST'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

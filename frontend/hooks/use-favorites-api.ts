'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiList, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { Property } from '@/types/property';

export function useFavoritesQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.favorites.list(query),
    queryFn: () => apiList<Property[]>(`/favorites?${query}`),
    enabled,
  });
}

export function useFavoriteCheckQuery(propertyId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.favorites.check(propertyId),
    queryFn: () => apiGet<{ saved: boolean }>(`/favorites/check/${propertyId}`),
    enabled: enabled && Boolean(propertyId),
  });
}

export function useToggleFavoriteMutation(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (saved: boolean) => {
      if (saved) {
        await apiSend(`/favorites/${propertyId}`, 'DELETE');
        return { saved: false };
      }
      await apiSend(`/favorites/${propertyId}`, 'POST');
      return { saved: true };
    },
    onSuccess: async (result) => {
      queryClient.setQueryData(queryKeys.favorites.check(propertyId), result);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.buyer }),
      ]);
    },
  });
}

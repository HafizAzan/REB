'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { BuyerDashboard } from '@/types/dashboard';

export function useBuyerDashboardQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.dashboard.buyer,
    queryFn: () => apiGet<BuyerDashboard>('/users/me/dashboard'),
    enabled,
  });
}

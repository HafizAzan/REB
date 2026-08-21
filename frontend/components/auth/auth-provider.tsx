'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { authKeys, useAuthUserQuery, useLogoutMutation } from '@/hooks/use-auth-api';
import type { AuthContextValue } from '@/types/auth';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const meQuery = useAuthUserQuery();
  const logoutMutation = useLogoutMutation();

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      queryClient.setQueryData(authKeys.me, null);
    }
  }, [logoutMutation, queryClient]);

  const value = useMemo(
    () => ({
      user: meQuery.data ?? null,
      loading: meQuery.isPending,
      refresh,
      logout,
    }),
    [logout, meQuery.data, meQuery.isPending, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

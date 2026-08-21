'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AuthUser, LoginResult, OtpIssued, OtpPurpose, OtpVerifyResult } from '@/types/auth';

export const authKeys = {
  me: queryKeys.auth.me,
};

export function useAuthUserQuery() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await apiGet<AuthUser>('/auth/me');
      } catch {
        return null;
      }
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiSend<LoginResult>('/auth/login', 'POST', body),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (body: { name: string; email: string; phone?: string; password: string }) =>
      apiSend<OtpIssued>('/auth/register', 'POST', body),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (body: { email: string }) =>
      apiSend<OtpIssued>('/auth/forgot-password', 'POST', body),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (body: { email: string; purpose: OtpPurpose; code: string }) =>
      apiSend<OtpVerifyResult>('/auth/otp/verify', 'POST', body),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (body: { email: string; purpose: OtpPurpose }) =>
      apiSend<OtpIssued>('/auth/otp/resend', 'POST', body),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (body: { email: string; resetToken: string; password: string }) =>
      apiSend<{ reset: true }>('/auth/reset-password', 'POST', body),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiSend('/auth/logout', 'POST'),
    onSettled: async () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear();
    },
  });
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import type { AuthUser, OtpIssued } from '@/types/auth';

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; phone?: string }) =>
      apiSend<AuthUser>('/users/me', 'PATCH', body),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      apiSend<{ updated: true }>('/users/me/password', 'PATCH', body),
  });
}

export function useRequestEmailChangeMutation() {
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiSend<OtpIssued>('/users/me/email', 'POST', body),
  });
}

export function useResendEmailChangeMutation() {
  return useMutation({
    mutationFn: (body: { email: string }) =>
      apiSend<OtpIssued>('/users/me/email/resend', 'POST', body),
  });
}

export function useVerifyEmailChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; code: string }) =>
      apiSend<AuthUser>('/users/me/email/verify', 'POST', body),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}

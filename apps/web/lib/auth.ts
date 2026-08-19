import type { Role } from '@/types/auth';

export function homeForRole(role: Role) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'AGENT') return '/agent';
  return '/dashboard';
}

const DEV_OTP_KEY = 'estatex_dev_otp';
const RESET_TOKEN_KEY = 'estatex_reset_token';
const RESET_EMAIL_KEY = 'estatex_reset_email';

export function rememberDevOtp(code?: string) {
  if (typeof window === 'undefined') return;
  if (code) sessionStorage.setItem(DEV_OTP_KEY, code);
  else sessionStorage.removeItem(DEV_OTP_KEY);
}

export function readDevOtp() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(DEV_OTP_KEY);
}

export function rememberResetTicket(email: string, token: string) {
  sessionStorage.setItem(RESET_EMAIL_KEY, email);
  sessionStorage.setItem(RESET_TOKEN_KEY, token);
}

export function readResetTicket() {
  if (typeof window === 'undefined') return null;
  const email = sessionStorage.getItem(RESET_EMAIL_KEY);
  const resetToken = sessionStorage.getItem(RESET_TOKEN_KEY);
  if (!email || !resetToken) return null;
  return { email, resetToken };
}

export function clearResetTicket() {
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(RESET_TOKEN_KEY);
  sessionStorage.removeItem(DEV_OTP_KEY);
}

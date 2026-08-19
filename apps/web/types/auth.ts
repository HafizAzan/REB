export type Role = 'USER' | 'AGENT' | 'ADMIN';

export type OtpPurpose = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  emailVerifiedAt?: string | null;
}

export interface OtpIssued {
  email: string;
  purpose: OtpPurpose;
  expiresInSeconds: number;
  cooldownSeconds: number;
  devOtp?: string;
}

export interface OtpVerifyResult {
  next: 'authenticated' | 'reset_password';
  user?: AuthUser;
  resetToken?: string;
  email?: string;
}

export type LoginResult =
  | { next: 'authenticated'; user: AuthUser }
  | ({ next: 'verify_email' } & OtpIssued);

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface ResetTicket {
  email: string;
  resetToken: string;
}

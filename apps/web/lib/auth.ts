export type Role = 'USER' | 'AGENT' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
}

export function homeForRole(role: Role) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'AGENT') return '/agent';
  return '/dashboard';
}

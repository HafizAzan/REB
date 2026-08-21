import type { ReactNode } from 'react';

export interface AuthShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

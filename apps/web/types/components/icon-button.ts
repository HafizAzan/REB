import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonTone = 'default' | 'danger';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  href?: string;
  tone?: IconButtonTone;
  icon: ReactNode;
}

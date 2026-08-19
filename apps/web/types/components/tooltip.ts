import type { ReactNode } from 'react';

export type TooltipSide = 'top' | 'bottom';

export interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: TooltipSide;
}

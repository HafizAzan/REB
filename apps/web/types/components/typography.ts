import type { ElementType, HTMLAttributes } from 'react';

export type TypographyVariant =
  | 'eyebrow'
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'muted'
  | 'caption';

export type TypographyTone = 'default' | 'gold' | 'paper' | 'soft';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TypographyVariant;
  tone?: TypographyTone;
}

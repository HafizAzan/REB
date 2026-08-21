import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { TypographyProps } from '@/types/components/typography';

const typographyVariants = cva('', {
  variants: {
    variant: {
      eyebrow: 'text-xs uppercase tracking-[0.18em] text-gold-dark',
      display: 'font-display text-5xl leading-[1.05] sm:text-6xl',
      title: 'font-display text-4xl sm:text-5xl',
      heading: 'font-display text-3xl',
      subheading: 'font-display text-2xl',
      body: 'text-sm leading-6 text-ink',
      muted: 'text-sm text-ink-soft',
      caption: 'text-xs text-ink-soft',
    },
    tone: {
      default: '',
      gold: 'text-gold-dark',
      paper: 'text-paper',
      soft: 'text-ink-soft',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});

const defaultTags = {
  eyebrow: 'p',
  display: 'h1',
  title: 'h1',
  heading: 'h2',
  subheading: 'h3',
  body: 'p',
  muted: 'p',
  caption: 'p',
} as const;

export function Typography({
  as,
  variant = 'body',
  tone,
  className,
  children,
  ...props
}: TypographyProps) {
  const Tag = as ?? defaultTags[variant];
  return (
    <Tag className={cn(typographyVariants({ variant, tone }), className)} {...props}>
      {children}
    </Tag>
  );
}

import type { ReactNode } from 'react';
import { Typography } from '@/components/ui/typography';

export function ProsePage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Typography variant="eyebrow">{eyebrow}</Typography>
      <Typography variant="display" className="mt-2">
        {title}
      </Typography>
      {lede ? (
        <Typography variant="muted" className="mt-6 text-lg leading-8">
          {lede}
        </Typography>
      ) : null}
      <div className="mt-10 space-y-8 text-sm leading-7 text-ink">{children}</div>
    </div>
  );
}

export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <Typography variant="subheading" className="mb-3">
        {title}
      </Typography>
      {children}
    </section>
  );
}

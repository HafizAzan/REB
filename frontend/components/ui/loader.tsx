import { Loader2 } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { LoaderProps, SpinnerProps } from '@/types/components/loader';

const spinnerSize = {
  sm: 'h-4 w-4',
  md: 'h-7 w-7',
  lg: 'h-10 w-10',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      aria-hidden
      className={cn('animate-spin text-gold-dark', spinnerSize[size], className)}
    />
  );
}

export function Loader({
  label = 'Loading…',
  fullscreen = false,
  size = 'md',
  className,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullscreen && 'min-h-[50vh] px-4 py-20',
        className,
      )}
    >
      <Spinner size={size} />
      {label ? <Typography variant="muted">{label}</Typography> : null}
      <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
  );
}

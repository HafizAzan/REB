import { cn } from '@/lib/utils';
import type { TooltipProps } from '@/types/components/tooltip';

export function Tooltip({ label, children, side = 'top' }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper opacity-0 shadow-sm transition duration-200',
          'invisible group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100',
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
        )}
      >
        {label}
      </span>
    </span>
  );
}

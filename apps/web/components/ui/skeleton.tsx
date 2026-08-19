import { cn } from '@/lib/utils';
import type {
  AgentGridSkeletonProps,
  ListRowsSkeletonProps,
  PropertyGridSkeletonProps,
  SkeletonProps,
  TableSkeletonProps,
} from '@/types/components/skeleton';

function times(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-md bg-mist',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-paper/70 after:to-transparent',
        className,
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <div className="flex gap-3 border-t border-line pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </article>
  );
}

export function PropertyGridSkeleton({
  count = 6,
  columns = 3,
  className,
}: PropertyGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading listings"
      className={cn(
        'grid gap-6',
        columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {times(count).map((index) => (
        <PropertyCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading listings</span>
    </div>
  );
}

export function AgentCardSkeleton({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'rounded-2xl border p-6',
        dark ? 'border-white/10 bg-white/5' : 'border-line bg-white',
      )}
    >
      <Skeleton className={cn('h-7 w-40', dark && 'bg-white/15 after:via-white/20')} />
      <Skeleton className={cn('mt-2 h-4 w-28', dark && 'bg-white/15 after:via-white/20')} />
      <Skeleton className={cn('mt-4 h-4 w-full', dark && 'bg-white/15 after:via-white/20')} />
      <Skeleton className={cn('mt-2 h-4 w-5/6', dark && 'bg-white/15 after:via-white/20')} />
      <Skeleton className={cn('mt-2 h-4 w-2/3', dark && 'bg-white/15 after:via-white/20')} />
    </div>
  );
}

export function AgentGridSkeleton({
  count = 6,
  tone = 'light',
  className,
}: AgentGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading agents"
      className={cn('grid gap-6 md:grid-cols-3', className)}
    >
      {times(count).map((index) => (
        <AgentCardSkeleton key={index} tone={tone} />
      ))}
      <span className="sr-only">Loading agents</span>
    </div>
  );
}

export function TableSkeleton({ rows = 8, columns = 4, className }: TableSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading table"
      className={cn('overflow-hidden rounded-2xl border border-line bg-white', className)}
    >
      <div className="grid gap-4 border-b border-line px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {times(columns).map((index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>
      {times(rows).map((row) => (
        <div
          key={row}
          className="grid gap-4 border-b border-line/70 px-4 py-4 last:border-0"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {times(columns).map((column) => (
            <Skeleton key={column} className={cn('h-4', column === 0 ? 'w-3/4' : 'w-1/2')} />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading table</span>
    </div>
  );
}

export function TablePageSkeleton({ rows = 8, columns = 4 }: TableSkeletonProps) {
  return (
    <div>
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <TableSkeleton className="mt-8" rows={rows} columns={columns} />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {times(8).map((index) => (
          <div key={index} className="rounded-2xl border border-line bg-white p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {times(2).map((index) => (
          <div key={index} className="rounded-2xl border border-line bg-white p-6">
            <Skeleton className="h-6 w-40" />
            <div className="mt-6 space-y-4">
              {times(4).map((row) => (
                <div key={row}>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListRowsSkeleton({ rows = 3, className }: ListRowsSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {times(rows).map((index) => (
        <div key={index} className="rounded-2xl border border-line bg-white p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-2 h-3 w-24" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <article
      role="status"
      aria-live="polite"
      aria-label="Loading listing"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
    >
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 border-b border-line pb-8">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-12 w-3/4 max-w-xl" />
        <Skeleton className="mt-3 h-4 w-64" />
        <Skeleton className="mt-5 h-9 w-40" />
      </div>
      <Skeleton className="mt-8 h-[460px] w-full rounded-[1.75rem]" />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {times(3).map((index) => (
          <Skeleton key={index} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {times(3).map((index) => (
          <Skeleton key={index} className="h-16 rounded-2xl" />
        ))}
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-10 h-7 w-32" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {times(6).map((index) => (
              <Skeleton key={index} className="h-11 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
      <span className="sr-only">Loading listing</span>
    </article>
  );
}

export function AgentProfileSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading agent"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
    >
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-12 w-64" />
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-4/5 max-w-xl" />
      <Skeleton className="mt-12 h-8 w-32" />
      <PropertyGridSkeleton className="mt-6" count={4} columns={2} />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-3xl space-y-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-8 h-11 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid gap-3 md:grid-cols-2">
        {times(6).map((index) => (
          <Skeleton key={index} className="h-11 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-36 rounded-full" />
    </div>
  );
}

export function WorkspacePageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-12 w-48" />
      <div className="mt-8 flex gap-2">
        {times(3).map((index) => (
          <Skeleton key={index} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-10">
        <TablePageSkeleton />
      </div>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-12 w-40" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-2 lg:flex-col">
          {times(3).map((index) => (
            <Skeleton key={index} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <div className="space-y-4 rounded-[1.75rem] border border-line bg-white p-6 sm:p-8">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16"
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-10 w-56" />
      <Skeleton className="mt-3 h-4 w-full" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-3 h-12 w-64" />
      <Skeleton className="mt-12 h-8 w-36" />
      <PropertyGridSkeleton className="mt-6" count={3} />
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <Skeleton className="h-8 w-32" />
          <ListRowsSkeleton className="mt-4" />
        </div>
        <div>
          <Skeleton className="h-8 w-24" />
          <ListRowsSkeleton className="mt-4" />
        </div>
      </div>
    </div>
  );
}

export function PropertiesBrowserSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-12 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-56" />
      <Skeleton className="mt-8 h-28 w-full rounded-2xl" />
      <PropertyGridSkeleton className="mt-10" />
    </div>
  );
}

export function MapSkeleton() {
  return <Skeleton className="h-80 w-full rounded-2xl" />;
}

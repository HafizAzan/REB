import { TableSkeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DataTableProps } from '@/types/components/data-table';

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = 'No records yet.',
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton columns={columns.length} />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line text-ink-soft">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn('px-4 py-3 font-medium', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-soft">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line/70 last:border-0">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3 align-top', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBars({
  title,
  items,
  total,
}: {
  title: string;
  items: Record<string, number>;
  total: number;
}) {
  const rows = Object.entries(items);
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <Typography variant="subheading">{title}</Typography>
      <ul className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <li>
            <Typography variant="muted">No data yet.</Typography>
          </li>
        ) : (
          rows.map(([label, count]) => {
            const width = total > 0 ? Math.max(4, Math.round((count / total) * 100)) : 0;
            return (
              <li key={label}>
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="text-ink-soft">{count}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${width}%` }} />
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export function GroupedBarChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; color: string; values: number[] }[];
}) {
  const max = Math.max(1, ...series.flatMap((item) => item.values));
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <Typography variant="subheading">Activity</Typography>
      <Typography variant="muted" className="mt-1">
        Saved homes, inquiries, and visits over the last six months.
      </Typography>
      <div className="mt-8 flex h-44 items-end gap-4 sm:gap-6">
        {labels.map((label, index) => (
          <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end justify-center gap-1">
              {series.map((item) => {
                const value = item.values[index] ?? 0;
                const height = Math.round((value / max) * 100);
                return (
                  <div
                    key={item.name}
                    title={`${item.name}: ${value}`}
                    className="w-2.5 rounded-t-sm sm:w-3"
                    style={{ height: `${Math.max(value > 0 ? 8 : 2, height)}%`, background: item.color }}
                  />
                );
              })}
            </div>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-ink-soft">
        {series.map((item) => (
          <span key={item.name} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </section>
  );
}

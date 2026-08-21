import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import type { PaginationProps } from '@/types/components/pagination';

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages < 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link
          href={hrefForPage(page - 1)}
          className="rounded-full border border-line px-4 py-2 text-sm transition hover:bg-cream"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-full border border-transparent px-4 py-2 text-sm text-ink-soft/50">
          Previous
        </span>
      )}
      <Typography variant="muted">
        Page {page} of {totalPages}
      </Typography>
      {page < totalPages ? (
        <Link
          href={hrefForPage(page + 1)}
          className="rounded-full border border-line px-4 py-2 text-sm transition hover:bg-cream"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-full border border-transparent px-4 py-2 text-sm text-ink-soft/50">
          Next
        </span>
      )}
    </div>
  );
}

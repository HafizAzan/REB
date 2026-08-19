import { Typography } from '@/components/ui/typography';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <Typography variant="eyebrow">404</Typography>
      <Typography variant="title" className="mt-2">
        This page doesn’t exist
      </Typography>
      <Typography variant="muted" className="mt-3">
        The listing may have been archived, or the URL is wrong.
      </Typography>
      <a href="/properties" className="mt-6 inline-block text-sm underline">
        Back to properties
      </a>
    </div>
  );
}

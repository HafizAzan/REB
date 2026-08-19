import { Typography } from '@/components/ui/typography';
import type { AuthShellProps } from '@/types/components/auth-shell';

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Typography variant="eyebrow">{eyebrow}</Typography>
      <Typography variant="title" className="mt-2">
        {title}
      </Typography>
      {description ? (
        <Typography variant="muted" className="mt-2">
          {description}
        </Typography>
      ) : null}
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}

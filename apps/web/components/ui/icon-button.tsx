import Link from 'next/link';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { IconButtonProps } from '@/types/components/icon-button';

export function IconButton({
  label,
  href,
  tone = 'default',
  icon,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  const styles = cn(
    'grid h-9 w-9 place-items-center rounded-full transition',
    tone === 'danger'
      ? 'text-ink-soft hover:bg-red-50 hover:text-red-700'
      : 'text-ink-soft hover:bg-cream hover:text-ink',
    className,
  );

  if (href) {
    return (
      <Tooltip label={label}>
        <Link href={href} aria-label={label} className={styles}>
          {icon}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={label}>
      <button type={type} aria-label={label} className={styles} {...props}>
        {icon}
      </button>
    </Tooltip>
  );
}

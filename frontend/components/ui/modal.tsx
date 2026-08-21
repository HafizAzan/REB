'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Portal } from '@/components/ui/portal';
import { usePresence } from '@/hooks/use-presence';
import { cn } from '@/lib/utils';

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const mounted = usePresence(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
        <button
          type="button"
          aria-label="Close dialog"
          className={cn(
            'absolute inset-0 bg-ink/45 backdrop-blur-[2px]',
            open ? 'animate-overlay-in' : 'animate-overlay-out',
          )}
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="estatex-modal-title"
          className={cn(
            'estatex-menu relative z-10 w-full max-w-md rounded-2xl p-6',
            open ? 'animate-pop-in' : 'animate-pop-out',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id="estatex-modal-title" className="font-display text-2xl text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </Portal>
  );
}

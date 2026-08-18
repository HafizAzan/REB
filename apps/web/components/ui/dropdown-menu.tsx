'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Portal } from '@/components/ui/portal';
import { useAnchorBox } from '@/hooks/use-anchor-box';
import { usePresence } from '@/hooks/use-presence';
import { cn } from '@/lib/utils';

const CloseMenu = createContext<() => void>(() => undefined);

export function DropdownMenu({
  trigger,
  children,
  align = 'end',
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const mounted = usePresence(open);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const box = useAnchorBox(open, rootRef);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {mounted && box ? (
        <Portal>
          <CloseMenu.Provider value={() => setOpen(false)}>
            <div
              ref={panelRef}
              id={menuId}
              role="menu"
              style={{
                position: 'fixed',
                top: box.bottom + 10,
                zIndex: 80,
                minWidth: Math.max(208, box.width),
                ...(align === 'end'
                  ? { right: window.innerWidth - box.right }
                  : { left: box.left }),
              }}
              className={cn(
                'estatex-menu overflow-hidden rounded-2xl py-1.5',
                open ? 'animate-pop-in' : 'animate-pop-out',
              )}
            >
              {children}
            </div>
          </CloseMenu.Provider>
        </Portal>
      ) : null}
    </div>
  );
}

export function DropdownItem({
  href,
  onSelect,
  children,
  tone = 'default',
}: {
  href?: string;
  onSelect?: () => void;
  children: ReactNode;
  tone?: 'default' | 'muted';
}) {
  const close = useContext(CloseMenu);
  const className = cn(
    'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-200',
    tone === 'muted' ? 'text-ink-soft hover:bg-cream hover:text-ink' : 'text-ink hover:bg-cream',
  );

  if (href) {
    return (
      <Link href={href} role="menuitem" className={className} onClick={close}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={className}
      onClick={() => {
        onSelect?.();
        close();
      }}
    >
      {children}
    </button>
  );
}

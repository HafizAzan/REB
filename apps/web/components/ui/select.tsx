'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Portal } from '@/components/ui/portal';
import { useAnchorBox } from '@/hooks/use-anchor-box';
import { usePresence } from '@/hooks/use-presence';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select',
  className,
}: {
  name?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value ?? defaultValue ?? '');
  const selected = value ?? internal;
  const mounted = usePresence(open);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const box = useAnchorBox(open, rootRef);
  const label = options.find((option) => option.value === selected)?.label ?? placeholder;

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

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

  function choose(next: string) {
    setInternal(next);
    onChange?.(next);
    setOpen(false);
  }

  const spaceBelow = box ? window.innerHeight - box.bottom : 0;
  const openUp = Boolean(box && spaceBelow < 260 && box.top > spaceBelow);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-open={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-line bg-white px-3.5 text-left text-sm text-ink outline-none transition duration-200 hover:border-ink/30 focus:border-gold focus:ring-2 focus:ring-gold/20 data-[open=true]:border-gold data-[open=true]:ring-2 data-[open=true]:ring-gold/20"
      >
        <span className={selected ? 'text-ink' : 'text-ink-soft/60'}>{label}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-ink-soft transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      {mounted && box ? (
        <Portal>
          <ul
            ref={panelRef}
            id={listId}
            role="listbox"
            style={{
              position: 'fixed',
              left: box.left,
              width: box.width,
              zIndex: 80,
              ...(openUp
                ? { bottom: window.innerHeight - box.top + 8 }
                : { top: box.bottom + 8 }),
            }}
            className={cn(
              'estatex-menu estatex-scroll max-h-64 overflow-y-auto overflow-x-hidden rounded-2xl py-1.5',
              open ? 'animate-pop-in' : 'animate-pop-out',
            )}
          >
            {options.map((option, index) => {
              const active = option.value === selected;
              return (
                <li key={option.value || `empty-${index}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors duration-150',
                      active ? 'bg-mist text-ink' : 'text-ink hover:bg-cream',
                    )}
                  >
                    {option.label}
                    {active ? <Check className="h-3.5 w-3.5 text-gold-dark" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Portal>
      ) : null}
    </div>
  );
}

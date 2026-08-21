import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-gold focus:ring-2 focus:ring-gold/20',
        className,
      )}
      {...props}
    />
  );
}

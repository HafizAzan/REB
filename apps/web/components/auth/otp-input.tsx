'use client';

import { useEffect, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

export function OtpInput({
  value,
  onChange,
  disabled,
  length = 6,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  length?: number;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    refs.current[Math.min(pasted.length, length) - 1]?.focus();
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digit}
          onPaste={onPaste}
          onKeyDown={(event) => onKeyDown(event, index)}
          onChange={(event) => {
            const nextDigit = event.target.value.replace(/\D/g, '').slice(-1);
            setDigit(index, nextDigit);
            if (nextDigit && index < length - 1) {
              refs.current[index + 1]?.focus();
            }
          }}
          className={cn(
            'h-12 w-11 rounded-xl border border-line bg-white text-center font-display text-xl text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:opacity-50',
          )}
        />
      ))}
    </div>
  );
}

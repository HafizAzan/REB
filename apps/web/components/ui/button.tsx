import { cva } from 'class-variance-authority';
import { Spinner } from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types/components/button';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-ink/90 shadow-sm hover:-translate-y-0.5',
        gold: 'bg-gold text-ink hover:bg-gold-dark hover:-translate-y-0.5',
        outline: 'border border-line bg-transparent text-ink hover:bg-cream',
        ghost: 'text-ink-soft hover:bg-cream hover:text-ink',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-5',
        lg: 'h-12 px-7 text-[15px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export function Button({
  className,
  variant,
  size,
  type = 'button',
  loading = false,
  fullWidth = false,
  leftIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
      {...props}
    >
      {loading ? <Spinner size="sm" className="text-current" /> : leftIcon}
      {children}
    </button>
  );
}

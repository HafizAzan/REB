export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export interface LoaderProps {
  label?: string;
  fullscreen?: boolean;
  size?: SpinnerSize;
  className?: string;
}

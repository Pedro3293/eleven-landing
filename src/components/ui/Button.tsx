'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg' | 'sm';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink font-semibold active:brightness-90',
  secondary: 'bg-surface-2 text-ink border border-line active:bg-surface',
  ghost: 'text-muted active:text-ink',
  danger: 'bg-danger/15 text-danger border border-danger/30 active:bg-danger/25',
};

// Alturas ≥44px (target táctil) salvo `sm` para acciones secundarias densas
const SIZES: Record<Size, string> = {
  lg: 'h-13 min-h-[52px] px-6 text-base',
  md: 'h-11 min-h-[44px] px-4 text-sm',
  sm: 'h-9 px-3 text-sm',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, className = '', children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-control transition-[filter,background-color] disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

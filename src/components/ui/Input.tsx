'use client';

import { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, className = '', id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`h-11 rounded-control border border-line bg-surface-2 px-3 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none ${className}`}
        {...rest}
      />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
});

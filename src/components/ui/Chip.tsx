'use client';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}

export function Chip({ label, selected, onToggle, disabled }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={`h-11 rounded-full border px-4 text-sm transition-colors disabled:opacity-40 ${
        selected
          ? 'border-accent bg-accent/10 font-medium text-accent'
          : 'border-line bg-surface-2 text-ink active:border-muted'
      }`}
    >
      {label}
    </button>
  );
}

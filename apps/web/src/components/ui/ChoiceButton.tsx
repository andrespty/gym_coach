import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChoiceButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}

/** A large, tappable option row. Used by ChoiceGroup and MultiChoiceGroup. */
export function ChoiceButton({ selected, onClick, children }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'min-h-12 rounded-2xl border px-4 text-left text-base font-medium transition',
        selected ? 'border-accent bg-raised text-ink' : 'border-line text-ink-soft hover:bg-raised',
      )}
    >
      {children}
    </button>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ChipProps {
  children: ReactNode;
  tone?: 'neutral' | 'accent';
}

export function Chip({ children, tone = 'neutral' }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'accent' ? 'bg-raised text-accent' : 'bg-raised text-ink-soft',
      )}
    >
      {children}
    </span>
  );
}

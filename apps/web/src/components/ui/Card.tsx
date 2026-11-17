import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-surface border-line rounded-3xl border p-4', className)} {...props} />
  );
}

import type { ReactNode } from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-3 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-ink-soft text-sm leading-relaxed">{description}</p>
      {action}
    </Card>
  );
}

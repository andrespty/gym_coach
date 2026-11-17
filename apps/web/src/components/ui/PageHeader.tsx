import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function PageHeader({ title, eyebrow, action }: PageHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        {eyebrow && <span className="text-muted text-sm font-medium">{eyebrow}</span>}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      {action}
    </header>
  );
}

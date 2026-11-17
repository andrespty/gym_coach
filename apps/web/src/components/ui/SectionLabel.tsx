import type { ReactNode } from 'react';

/** Small uppercase label above a group: "PROGRAM · WEEK 3 OF 10". */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted text-xs font-semibold uppercase tracking-wider">{children}</span>
  );
}

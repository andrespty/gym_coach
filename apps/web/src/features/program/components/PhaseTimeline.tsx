import type { ProgramPhase } from '@gym-coach/core';
import { SectionLabel } from '@/components/ui';

export function PhaseTimeline({ phases }: { phases: readonly ProgramPhase[] }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Phases</SectionLabel>
      <ol className="flex flex-col gap-1.5">
        {phases.map((phase) => (
          <li key={phase.name} className="flex justify-between gap-3 text-sm">
            <span className="font-semibold">{phase.name}</span>
            <span className="text-muted text-right">
              <span className="font-mono">
                W{phase.startWeek}–{phase.endWeek}
              </span>{' '}
              · {phase.focus}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

import type { StoredProgram } from '@/features/program';
import { Card, ProgressBar, SectionLabel } from '@/components/ui';

interface ProgramCardProps {
  program: StoredProgram;
  weekNumber: number;
}

export function ProgramCard({ program, weekNumber }: ProgramCardProps) {
  const { plan } = program;
  const week = Math.min(weekNumber, plan.durationWeeks);
  const phase = plan.phases.find((p) => week >= p.startWeek && week <= p.endWeek);

  return (
    <Card className="flex flex-col gap-2.5">
      <SectionLabel>
        Program · week {week} of {plan.durationWeeks}
        {phase ? ` · ${phase.name}` : ''}
      </SectionLabel>
      <span className="text-xl font-semibold">{plan.name}</span>
      <ProgressBar value={week / plan.durationWeeks} label="Program progress" />
    </Card>
  );
}

import { Button, EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/ui';
import { useActivateProgram } from '../hooks/useActivateProgram';
import { useCurrentProgram } from '../hooks/useCurrentProgram';
import { CoachNotes } from './CoachNotes';
import { PhaseTimeline } from './PhaseTimeline';
import { SlotCard } from './SlotCard';

export function ProgramPage() {
  const { data: program, isLoading, error } = useCurrentProgram();
  const activate = useActivateProgram();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!program) {
    return (
      <EmptyState
        title="No program yet"
        description="Finish onboarding and your coach will draft one."
      />
    );
  }

  const { plan } = program;
  const isDraft = program.status === 'draft';

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow={isDraft ? 'Draft: review before starting' : `${plan.durationWeeks} weeks`}
        title={plan.name}
      />
      <p className="text-ink-soft leading-relaxed">{plan.summary}</p>
      <CoachNotes notes={plan.coachNotes} />
      <PhaseTimeline phases={plan.phases} />
      {plan.weeklySlots.map((slot) => (
        <SlotCard key={slot.day} slot={slot} />
      ))}
      {isDraft && (
        <Button fullWidth onClick={() => activate.mutate(program.id)} disabled={activate.isPending}>
          {activate.isPending ? 'Starting…' : 'Start this program'}
        </Button>
      )}
      {activate.error && <ErrorState error={activate.error} />}
    </div>
  );
}

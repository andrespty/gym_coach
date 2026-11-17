import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/ui';
import { formatLongDate } from '@/lib/format';
import { useTodayOverview } from '../hooks/useTodayOverview';
import { ProgramCard } from './ProgramCard';
import { RestDayCard } from './RestDayCard';
import { TodaySessionCard } from './TodaySessionCard';
import { WeekStrip } from './WeekStrip';

export function TodayPage() {
  const today = new Date();
  const overview = useTodayOverview(today);

  if (overview.isLoading) return <LoadingState />;
  if (overview.error) return <ErrorState error={overview.error} />;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow={formatLongDate(today)} title="Today" />

      {overview.program ? (
        <>
          <ProgramCard program={overview.program} weekNumber={overview.weekNumber} />
          <WeekStrip days={overview.week} />
          {overview.todaySlot ? <TodaySessionCard slot={overview.todaySlot} /> : <RestDayCard />}
        </>
      ) : (
        <EmptyState
          title={overview.hasDraft ? 'Your program is ready to review' : 'No active program'}
          description={
            overview.hasDraft
              ? 'Read your coach’s draft and start it when you’re happy with it.'
              : 'Finish onboarding to get your first program.'
          }
          action={
            <Link to="/program" className="text-accent font-semibold">
              Go to program
            </Link>
          }
        />
      )}
    </div>
  );
}

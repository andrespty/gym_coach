import { Link } from 'react-router-dom';
import { usePreferredUnit } from '@/features/profile';
import { useTodayOverview } from '@/features/today';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui';
import { WorkoutLogger } from './WorkoutLogger';

/** Route for logging today's planned session. */
export function LogPage() {
  const overview = useTodayOverview();
  const unit = usePreferredUnit();

  if (overview.isLoading) return <LoadingState />;
  if (overview.error) return <ErrorState error={overview.error} />;

  if (!overview.program || !overview.todaySlot) {
    return (
      <main className="mx-auto max-w-md px-5 pt-6">
        <EmptyState
          title="Nothing planned today"
          description="There is no session in your program for today."
          action={
            <Link to="/" className="text-accent font-semibold">
              Back to Today
            </Link>
          }
        />
      </main>
    );
  }

  return <WorkoutLogger programId={overview.program.id} slot={overview.todaySlot} unit={unit} />;
}

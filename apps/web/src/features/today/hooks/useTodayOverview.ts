import { useQuery } from '@tanstack/react-query';
import { useCurrentProgram } from '@/features/program';
import { dayOfWeek, startOfWeek } from '@/lib/dates';
import { fetchCompletedDates } from '../api/todayApi';
import { buildWeek, programWeek } from '../model/buildWeek';

/** Everything the Today screen shows: the program, this week, and today's planned session. */
export function useTodayOverview(today = new Date()) {
  const programQuery = useCurrentProgram();
  const weekStart = startOfWeek(today);
  const completedQuery = useQuery({
    queryKey: ['sessions', 'completed', weekStart.toISOString()],
    queryFn: () => fetchCompletedDates(weekStart),
  });

  const program = programQuery.data?.status === 'active' ? programQuery.data : null;
  const slots = program?.plan.weeklySlots ?? [];
  const trainingDays = new Set(slots.map((slot) => slot.day));

  return {
    isLoading: programQuery.isLoading || completedQuery.isLoading,
    error: programQuery.error ?? completedQuery.error,
    hasDraft: programQuery.data?.status === 'draft',
    program,
    week: buildWeek(today, trainingDays, new Set(completedQuery.data ?? [])),
    weekNumber: programWeek(program?.startedOn ?? null, today),
    todaySlot: slots.find((slot) => slot.day === dayOfWeek(today)) ?? null,
  };
}

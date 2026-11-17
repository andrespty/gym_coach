import { DAYS_OF_WEEK, type DayOfWeek } from '@gym-coach/core';
import { startOfWeek, toIsoDate } from '@/lib/dates';

export type WeekDayState = 'done' | 'today' | 'planned' | 'missed' | 'rest';

export interface WeekDay {
  day: DayOfWeek;
  dateOfMonth: number;
  state: WeekDayState;
}

/** Monday-to-Sunday view of this week: what's done, what's planned, and what was skipped. */
export function buildWeek(
  today: Date,
  trainingDays: ReadonlySet<DayOfWeek>,
  completedDates: ReadonlySet<string>,
): WeekDay[] {
  const monday = startOfWeek(today);
  const todayIso = toIsoDate(today);

  return DAYS_OF_WEEK.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const iso = toIsoDate(date);

    let state: WeekDayState;
    if (completedDates.has(iso)) state = 'done';
    else if (iso === todayIso) state = 'today';
    else if (!trainingDays.has(day)) state = 'rest';
    else state = iso < todayIso ? 'missed' : 'planned';

    return { day, dateOfMonth: date.getDate(), state };
  });
}

/** 1-based week of the program, from its start date. */
export function programWeek(startedOn: string | null, today: Date): number {
  if (!startedOn) return 1;
  const days = Math.floor(
    (today.getTime() - new Date(`${startedOn}T00:00:00`).getTime()) / 86_400_000,
  );
  return Math.max(1, Math.floor(days / 7) + 1);
}

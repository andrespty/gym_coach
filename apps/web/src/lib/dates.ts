import { DAYS_OF_WEEK, type DayOfWeek } from '@gym-coach/core';

/** Monday-first day id for a date. */
export function dayOfWeek(date: Date): DayOfWeek {
  const mondayFirstIndex = (date.getDay() + 6) % 7;
  return DAYS_OF_WEEK[mondayFirstIndex] as DayOfWeek;
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export function toIsoDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

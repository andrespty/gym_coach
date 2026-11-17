import { cn } from '@/lib/cn';
import type { WeekDay, WeekDayState } from '../model/buildWeek';

const STATE_CLASSES: Record<WeekDayState, string> = {
  done: 'bg-accent text-accent-ink',
  today: 'border-2 border-accent text-ink',
  planned: 'bg-raised text-ink-soft',
  missed: 'bg-raised text-muted line-through',
  rest: 'border border-dashed border-line text-muted',
};

const STATE_LABELS: Record<WeekDayState, string> = {
  done: 'completed',
  today: 'today',
  planned: 'planned',
  missed: 'not done',
  rest: 'rest day',
};

export function WeekStrip({ days }: { days: readonly WeekDay[] }) {
  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label="This week">
      {days.map((day) => (
        <li key={day.day} className="flex flex-col items-center gap-1.5">
          <span className="text-muted text-xs font-medium uppercase">{day.day.slice(0, 1)}</span>
          <span
            aria-label={`${day.day} ${day.dateOfMonth}, ${STATE_LABELS[day.state]}`}
            className={cn(
              'flex size-10 items-center justify-center rounded-xl font-mono text-sm font-bold',
              STATE_CLASSES[day.state],
            )}
          >
            {day.dateOfMonth}
          </span>
        </li>
      ))}
    </ol>
  );
}

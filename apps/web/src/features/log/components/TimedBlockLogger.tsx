import type { TimedBlock } from '@gym-coach/core';
import { DurationField, NumberField } from '@/components/ui';
import type { BlockEntry } from '../model/workoutLog';
import { DoneToggle } from './DoneToggle';

type TimedEntry = Extract<BlockEntry, { kind: 'timed' }>;
type TimedFormat = TimedBlock['format'];

interface TimedBlockLoggerProps {
  entry: TimedEntry;
  format: TimedFormat;
  onChange: (entry: TimedEntry) => void;
}

/** AMRAP records rounds + reps; for-time records a time; EMOM just needs to be marked done. */
export function TimedBlockLogger({ entry, format, onChange }: TimedBlockLoggerProps) {
  return (
    <div className="flex items-end gap-3">
      <div className="grid flex-1 gap-3">
        {format === 'amrap' && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Rounds"
              value={entry.rounds}
              onChange={(rounds) => onChange({ ...entry, rounds })}
            />
            <NumberField
              label="Extra reps"
              value={entry.extraReps}
              onChange={(extraReps) => onChange({ ...entry, extraReps })}
            />
          </div>
        )}
        {format === 'for_time' && (
          <DurationField
            label="Time"
            value={entry.timeSeconds}
            onChange={(timeSeconds) => onChange({ ...entry, timeSeconds })}
          />
        )}
      </div>
      <DoneToggle
        done={entry.done}
        label="Workout done"
        onToggle={() => onChange({ ...entry, done: !entry.done })}
      />
    </div>
  );
}

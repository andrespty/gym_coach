import { DurationField, NumberField } from '@/components/ui';
import type { BlockEntry } from '../model/workoutLog';
import { DoneToggle } from './DoneToggle';

type CardioEntry = Extract<BlockEntry, { kind: 'cardio' }>;

interface CardioBlockLoggerProps {
  entry: CardioEntry;
  distanceUnit: string;
  onChange: (entry: CardioEntry) => void;
}

export function CardioBlockLogger({ entry, distanceUnit, onChange }: CardioBlockLoggerProps) {
  return (
    <div className="flex items-end gap-3">
      <div className="grid flex-1 gap-3">
        <NumberField
          label="Distance"
          unit={distanceUnit}
          step={0.01}
          value={entry.distance}
          onChange={(distance) => onChange({ ...entry, distance })}
        />
        <DurationField
          label="Time"
          value={entry.durationSeconds}
          onChange={(durationSeconds) => onChange({ ...entry, durationSeconds })}
        />
      </div>
      <DoneToggle
        done={entry.done}
        label="Cardio done"
        onToggle={() => onChange({ ...entry, done: !entry.done })}
      />
    </div>
  );
}

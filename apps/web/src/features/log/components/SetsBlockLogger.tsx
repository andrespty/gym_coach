import { Button } from '@/components/ui';
import type { BlockEntry, SetEntry } from '../model/workoutLog';
import { SetRow } from './SetRow';

type SetsEntry = Extract<BlockEntry, { kind: 'sets' }>;

interface SetsBlockLoggerProps {
  entry: SetsEntry;
  unit: string;
  restSeconds: number;
  onChange: (entry: SetsEntry) => void;
  onAddSet: () => void;
  onSetComplete: (restSeconds: number) => void;
}

export function SetsBlockLogger({
  entry,
  unit,
  restSeconds,
  onChange,
  onAddSet,
  onSetComplete,
}: SetsBlockLoggerProps) {
  const replaceSet = (index: number, set: SetEntry) =>
    onChange({ ...entry, sets: entry.sets.map((existing, i) => (i === index ? set : existing)) });

  return (
    <div className="flex flex-col gap-3">
      {entry.sets.map((set, index) => (
        <SetRow
          key={index}
          setNumber={index + 1}
          value={set}
          unit={unit}
          onChange={(next) => replaceSet(index, next)}
          onComplete={() => onSetComplete(restSeconds)}
        />
      ))}
      <Button variant="ghost" onClick={onAddSet} className="self-start">
        + Add set
      </Button>
    </div>
  );
}

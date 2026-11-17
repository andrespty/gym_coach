import { NumberField } from '@/components/ui';
import type { SetEntry } from '../model/workoutLog';
import { DoneToggle } from './DoneToggle';

interface SetRowProps {
  setNumber: number;
  value: SetEntry;
  unit: string;
  onChange: (value: SetEntry) => void;
  onComplete: () => void;
}

export function SetRow({ setNumber, value, unit, onChange, onComplete }: SetRowProps) {
  const toggle = () => {
    const done = !value.done;
    onChange({ ...value, done });
    if (done) onComplete();
  };

  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_1fr_3rem] items-end gap-2">
      <span className="text-muted pb-3 font-mono text-sm font-bold">{setNumber}</span>
      <NumberField
        label={unit}
        value={value.weight}
        step={0.5}
        onChange={(weight) => onChange({ ...value, weight })}
      />
      <NumberField
        label="Reps"
        value={value.reps}
        onChange={(reps) => onChange({ ...value, reps })}
      />
      <NumberField
        label="RPE"
        value={value.rpe}
        step={0.5}
        onChange={(rpe) => onChange({ ...value, rpe })}
      />
      <DoneToggle done={value.done} label={`Set ${setNumber} done`} onToggle={toggle} />
    </div>
  );
}

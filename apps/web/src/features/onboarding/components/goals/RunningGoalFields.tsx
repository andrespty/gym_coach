import type { WeightUnit } from '@gym-coach/core';
import { DateField, DurationField, NumberField } from '@/components/ui';
import type { RunningGoalDraft } from '../../model/draft';
import { unitLabels } from '@/lib/units';

interface RunningGoalFieldsProps {
  value: RunningGoalDraft;
  unit: WeightUnit;
  onChange: (value: RunningGoalDraft) => void;
}

export function RunningGoalFields({ value, unit, onChange }: RunningGoalFieldsProps) {
  const { distance } = unitLabels(unit);
  const set = <Key extends keyof RunningGoalDraft>(key: Key, next: RunningGoalDraft[Key]) =>
    onChange({ ...value, [key]: next });

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Weekly distance"
          unit={distance}
          value={value.weeklyDistance}
          onChange={(v) => set('weeklyDistance', v)}
        />
        <NumberField
          label="Longest recent run"
          unit={distance}
          value={value.longestRun}
          onChange={(v) => set('longestRun', v)}
        />
      </div>

      <p className="text-muted text-sm">A recent race or time trial (optional).</p>
      <NumberField
        label="Race distance"
        unit={distance}
        value={value.raceDistance}
        onChange={(v) => set('raceDistance', v)}
      />
      <DurationField
        label="Race time"
        value={value.raceTimeSeconds}
        onChange={(v) => set('raceTimeSeconds', v)}
      />

      <p className="text-muted text-sm">What you’re training for (optional).</p>
      <NumberField
        label="Target distance"
        unit={distance}
        value={value.targetDistance}
        onChange={(v) => set('targetDistance', v)}
      />
      <DurationField
        label="Target time"
        value={value.targetTimeSeconds}
        onChange={(v) => set('targetTimeSeconds', v)}
      />
      <DateField
        label="Event date"
        value={value.targetDate}
        onChange={(v) => set('targetDate', v)}
      />
    </>
  );
}

import type { WeightUnit } from '@gym-coach/core';
import { DateField, NumberField } from '@/components/ui';
import type { FatLossGoalDraft } from '../../model/draft';
import { unitLabels } from '@/lib/units';

interface FatLossGoalFieldsProps {
  value: FatLossGoalDraft;
  unit: WeightUnit;
  onChange: (value: FatLossGoalDraft) => void;
}

export function FatLossGoalFields({ value, unit, onChange }: FatLossGoalFieldsProps) {
  const { weight, length } = unitLabels(unit);
  return (
    <>
      <p className="text-muted text-sm">Set a bodyweight target, a waist target, or both.</p>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Target weight"
          unit={weight}
          value={value.targetBodyweight}
          onChange={(targetBodyweight) => onChange({ ...value, targetBodyweight })}
        />
        <NumberField
          label="Target waist"
          unit={length}
          value={value.targetWaist}
          onChange={(targetWaist) => onChange({ ...value, targetWaist })}
        />
      </div>
      <DateField
        label="By (optional)"
        value={value.targetDate}
        onChange={(targetDate) => onChange({ ...value, targetDate })}
      />
    </>
  );
}

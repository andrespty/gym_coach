import { findExercise, STRENGTH_GOAL_EXERCISE_IDS, type WeightUnit } from '@gym-coach/core';
import { ChoiceGroup, DateField, NumberField } from '@/components/ui';
import type { StrengthGoalDraft } from '../../model/draft';
import { unitLabels } from '@/lib/units';

const LIFT_CHOICES = STRENGTH_GOAL_EXERCISE_IDS.map((id) => ({
  value: id,
  label: findExercise(id)?.name ?? id,
}));

interface StrengthGoalFieldsProps {
  value: StrengthGoalDraft;
  unit: WeightUnit;
  onChange: (value: StrengthGoalDraft) => void;
}

export function StrengthGoalFields({ value, unit, onChange }: StrengthGoalFieldsProps) {
  const { weight } = unitLabels(unit);
  return (
    <>
      <ChoiceGroup
        label="Which lift?"
        choices={LIFT_CHOICES}
        value={value.exerciseId as (typeof STRENGTH_GOAL_EXERCISE_IDS)[number] | null}
        onChange={(exerciseId) => onChange({ ...value, exerciseId })}
      />
      <p className="text-muted text-sm">Your best recent set. Leave it blank if you don’t know.</p>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Weight"
          unit={weight}
          value={value.bestWeight}
          onChange={(bestWeight) => onChange({ ...value, bestWeight })}
        />
        <NumberField
          label="Reps"
          value={value.bestReps}
          onChange={(bestReps) => onChange({ ...value, bestReps })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Target"
          unit={weight}
          value={value.targetWeight}
          onChange={(targetWeight) => onChange({ ...value, targetWeight })}
        />
        <DateField
          label="By (optional)"
          value={value.targetDate}
          onChange={(targetDate) => onChange({ ...value, targetDate })}
        />
      </div>
    </>
  );
}

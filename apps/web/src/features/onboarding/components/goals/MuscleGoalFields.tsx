import { MUSCLE_FOCUS_LABELS } from '@gym-coach/core';
import { MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import type { MuscleGoalDraft } from '../../model/draft';

interface MuscleGoalFieldsProps {
  value: MuscleGoalDraft;
  onChange: (value: MuscleGoalDraft) => void;
}

export function MuscleGoalFields({ value, onChange }: MuscleGoalFieldsProps) {
  return (
    <MultiChoiceGroup
      label="Areas to prioritise"
      hint="Leave empty for balanced development."
      choices={toChoices(MUSCLE_FOCUS_LABELS)}
      values={value.focusAreas}
      onChange={(focusAreas) => onChange({ ...value, focusAreas })}
    />
  );
}

import { CURRENT_FREQUENCY_LABELS, DISCIPLINE_LABELS, TRAINING_AGE_LABELS } from '@gym-coach/core';
import { ChoiceGroup, MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import type { BackgroundDraft } from '../../model/draft';

interface BackgroundStepProps {
  value: BackgroundDraft;
  onChange: (value: BackgroundDraft) => void;
}

export function BackgroundStep({ value, onChange }: BackgroundStepProps) {
  return (
    <>
      <ChoiceGroup
        label="How long have you trained consistently?"
        choices={toChoices(TRAINING_AGE_LABELS)}
        value={value.trainingAge}
        onChange={(trainingAge) => onChange({ ...value, trainingAge })}
      />
      <ChoiceGroup
        label="How often do you train right now?"
        choices={toChoices(CURRENT_FREQUENCY_LABELS)}
        value={value.currentFrequency}
        onChange={(currentFrequency) => onChange({ ...value, currentFrequency })}
      />
      <MultiChoiceGroup
        label="What have you done before?"
        hint="Pick all that apply."
        choices={toChoices(DISCIPLINE_LABELS)}
        values={value.disciplines}
        onChange={(disciplines) => onChange({ ...value, disciplines })}
      />
    </>
  );
}

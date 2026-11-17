import {
  EQUIPMENT,
  EQUIPMENT_LABELS,
  EQUIPMENT_PRESET_LABELS,
  EQUIPMENT_PRESETS,
  type EquipmentPreset,
} from '@gym-coach/core';
import { ChoiceGroup, MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import type { OnboardingDraft } from '../../model/draft';

type EquipmentDraft = OnboardingDraft['equipment'];

interface EquipmentStepProps {
  value: EquipmentDraft;
  onChange: (value: EquipmentDraft) => void;
}

/** Start from a preset, then fine-tune the checklist. */
export function EquipmentStep({ value, onChange }: EquipmentStepProps) {
  const choosePreset = (preset: EquipmentPreset) =>
    onChange({ preset, items: [...EQUIPMENT_PRESETS[preset]] });

  return (
    <>
      <ChoiceGroup
        label="Where do you train most?"
        choices={toChoices(EQUIPMENT_PRESET_LABELS)}
        value={value.preset}
        onChange={choosePreset}
      />
      {value.preset && (
        <MultiChoiceGroup
          label="What do you have?"
          hint="Adjust to match your gym exactly."
          choices={EQUIPMENT.map((item) => ({ value: item, label: EQUIPMENT_LABELS[item] }))}
          values={value.items}
          onChange={(items) => onChange({ ...value, items })}
        />
      )}
    </>
  );
}

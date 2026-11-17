import { SexSchema, type Sex, type WeightUnit } from '@gym-coach/core';
import { ChoiceGroup, NumberField } from '@/components/ui';
import type { BasicsDraft } from '../../model/draft';
import { unitLabels } from '@/lib/units';

const SEX_CHOICES = SexSchema.options.map((value) => ({
  value,
  label: value === 'male' ? 'Male' : 'Female',
}));
const UNIT_CHOICES: { value: WeightUnit; label: string }[] = [
  { value: 'lb', label: 'Pounds, inches, miles' },
  { value: 'kg', label: 'Kilograms, centimetres, kilometres' },
];

interface BasicsStepProps {
  value: BasicsDraft;
  onChange: (value: BasicsDraft) => void;
}

export function BasicsStep({ value, onChange }: BasicsStepProps) {
  const units = unitLabels(value.preferredUnit);
  const set = <Key extends keyof BasicsDraft>(key: Key, next: BasicsDraft[Key]) =>
    onChange({ ...value, [key]: next });

  return (
    <>
      <ChoiceGroup
        label="Units"
        choices={UNIT_CHOICES}
        value={value.preferredUnit}
        onChange={(unit) => set('preferredUnit', unit)}
      />
      <ChoiceGroup
        label="Sex"
        choices={SEX_CHOICES}
        value={value.sex}
        onChange={(sex: Sex) => set('sex', sex)}
      />
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Age" value={value.age} onChange={(age) => set('age', age)} />
        <NumberField
          label="Height"
          unit={units.length}
          value={value.height}
          onChange={(height) => set('height', height)}
        />
        <NumberField
          label="Weight"
          unit={units.weight}
          value={value.weight}
          onChange={(weight) => set('weight', weight)}
        />
      </div>
    </>
  );
}

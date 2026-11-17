import { BODY_AREA_LABELS, type Limitation } from '@gym-coach/core';
import { Card, ChoiceGroup } from '@/components/ui';

const SEVERITY_CHOICES: { value: Limitation['severity']; label: string }[] = [
  { value: 'mild', label: 'Mild: noticeable, but I train through it' },
  { value: 'moderate', label: 'Moderate: some movements hurt' },
  { value: 'severe', label: 'Severe: I avoid loading it' },
];

const WHEN_CHOICES: { value: Limitation['when']; label: string }[] = [
  { value: 'during', label: 'During exercise' },
  { value: 'after', label: 'After exercise' },
  { value: 'both', label: 'Both' },
];

interface LimitationEditorProps {
  value: Limitation;
  onChange: (value: Limitation) => void;
}

export function LimitationEditor({ value, onChange }: LimitationEditorProps) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold">{BODY_AREA_LABELS[value.area]}</h2>
      <ChoiceGroup
        label="How bad is it?"
        choices={SEVERITY_CHOICES}
        value={value.severity}
        onChange={(severity) => onChange({ ...value, severity })}
      />
      <ChoiceGroup
        label="When does it hurt?"
        choices={WHEN_CHOICES}
        value={value.when}
        onChange={(when) => onChange({ ...value, when })}
      />
    </Card>
  );
}

import { ChoiceButton } from './ChoiceButton';

export interface Choice<Value extends string> {
  value: Value;
  label: string;
}

interface ChoiceGroupProps<Value extends string> {
  label: string;
  choices: readonly Choice<Value>[];
  value: Value | null;
  onChange: (value: Value) => void;
}

/** Pick exactly one option. */
export function ChoiceGroup<Value extends string>({
  label,
  choices,
  value,
  onChange,
}: ChoiceGroupProps<Value>) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-base font-semibold">{label}</legend>
      {choices.map((choice) => (
        <ChoiceButton
          key={choice.value}
          selected={choice.value === value}
          onClick={() => onChange(choice.value)}
        >
          {choice.label}
        </ChoiceButton>
      ))}
    </fieldset>
  );
}

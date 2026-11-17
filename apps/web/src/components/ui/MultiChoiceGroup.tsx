import { ChoiceButton } from './ChoiceButton';
import type { Choice } from './ChoiceGroup';

interface MultiChoiceGroupProps<Value extends string> {
  label: string;
  hint?: string;
  choices: readonly Choice<Value>[];
  values: readonly Value[];
  onChange: (values: Value[]) => void;
  max?: number;
}

/** Pick any number of options (optionally capped). Selection order is preserved. */
export function MultiChoiceGroup<Value extends string>({
  label,
  hint,
  choices,
  values,
  onChange,
  max,
}: MultiChoiceGroupProps<Value>) {
  const toggle = (value: Value) => {
    if (values.includes(value)) onChange(values.filter((v) => v !== value));
    else if (max === undefined || values.length < max) onChange([...values, value]);
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 flex flex-col gap-1">
        <span className="text-base font-semibold">{label}</span>
        {hint && <span className="text-muted text-sm">{hint}</span>}
      </legend>
      {choices.map((choice) => (
        <ChoiceButton
          key={choice.value}
          selected={values.includes(choice.value)}
          onClick={() => toggle(choice.value)}
        >
          {choice.label}
        </ChoiceButton>
      ))}
    </fieldset>
  );
}

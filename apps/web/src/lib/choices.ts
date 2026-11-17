import type { Choice } from '@/components/ui';

/** Turns a { value: label } map into ChoiceGroup options, keeping key order. */
export function toChoices<Value extends string>(labels: Record<Value, string>): Choice<Value>[] {
  return (Object.keys(labels) as Value[]).map((value) => ({ value, label: labels[value] }));
}

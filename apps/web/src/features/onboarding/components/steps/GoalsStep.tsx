import { GOAL_TYPE_LABELS, type GoalType } from '@gym-coach/core';
import { MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import { emptyGoal, type GoalDraftState } from '../../model/draft';

const MAX_GOALS = 3;

interface GoalsStepProps {
  value: GoalDraftState[];
  onChange: (value: GoalDraftState[]) => void;
}

/** Pick up to three goals. The order you pick them in is their priority. */
export function GoalsStep({ value, onChange }: GoalsStepProps) {
  const selected = value.map((goal) => goal.type);

  const change = (types: GoalType[]) =>
    onChange(types.map((type) => value.find((goal) => goal.type === type) ?? emptyGoal(type)));

  return (
    <>
      <MultiChoiceGroup
        label="Pick up to three"
        hint="Pick your most important goal first. The order you choose sets the priority."
        choices={toChoices(GOAL_TYPE_LABELS)}
        values={selected}
        onChange={change}
        max={MAX_GOALS}
      />
      {selected.length > 0 && (
        <ol className="text-ink-soft flex flex-col gap-1 text-sm">
          {selected.map((type, index) => (
            <li key={type}>
              <span className="text-accent font-mono font-bold">{index + 1}.</span>{' '}
              {GOAL_TYPE_LABELS[type]}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

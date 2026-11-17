import { BENCHMARK_WORKOUTS, CONDITIONING_SKILL_LABELS } from '@gym-coach/core';
import { DurationField, MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import type { ConditioningGoalDraft } from '../../model/draft';

interface ConditioningGoalFieldsProps {
  value: ConditioningGoalDraft;
  onChange: (value: ConditioningGoalDraft) => void;
}

export function ConditioningGoalFields({ value, onChange }: ConditioningGoalFieldsProps) {
  return (
    <>
      <p className="text-muted text-sm">
        Benchmark times you know. Leave blank if you haven’t done them.
      </p>
      {BENCHMARK_WORKOUTS.map((name) => (
        <DurationField
          key={name}
          label={name}
          value={value.benchmarkSeconds[name] ?? null}
          onChange={(seconds) =>
            onChange({ ...value, benchmarkSeconds: { ...value.benchmarkSeconds, [name]: seconds } })
          }
        />
      ))}
      <MultiChoiceGroup
        label="Skills you want to learn"
        choices={toChoices(CONDITIONING_SKILL_LABELS)}
        values={value.skills}
        onChange={(skills) => onChange({ ...value, skills })}
      />
    </>
  );
}

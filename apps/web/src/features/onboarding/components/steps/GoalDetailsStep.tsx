import { GOAL_TYPE_LABELS, type WeightUnit } from '@gym-coach/core';
import { Card, SectionLabel } from '@/components/ui';
import type { GoalDraftState } from '../../model/draft';
import { GoalFields } from '../goals/GoalFields';

interface GoalDetailsStepProps {
  value: GoalDraftState[];
  unit: WeightUnit;
  onChange: (value: GoalDraftState[]) => void;
}

export function GoalDetailsStep({ value, unit, onChange }: GoalDetailsStepProps) {
  const replace = (index: number, goal: GoalDraftState) =>
    onChange(value.map((g, i) => (i === index ? goal : g)));

  return value.map((goal, index) => (
    <Card key={goal.type} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <SectionLabel>Goal {index + 1}</SectionLabel>
        <h2 className="text-xl font-semibold">{GOAL_TYPE_LABELS[goal.type]}</h2>
      </div>
      <GoalFields goal={goal} unit={unit} onChange={(next) => replace(index, next)} />
    </Card>
  ));
}

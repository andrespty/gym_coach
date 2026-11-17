import type { WeightUnit } from '@gym-coach/core';
import type { GoalDraftState } from '../../model/draft';
import { ConditioningGoalFields } from './ConditioningGoalFields';
import { FatLossGoalFields } from './FatLossGoalFields';
import { MuscleGoalFields } from './MuscleGoalFields';
import { RunningGoalFields } from './RunningGoalFields';
import { StrengthGoalFields } from './StrengthGoalFields';

interface GoalFieldsProps {
  goal: GoalDraftState;
  unit: WeightUnit;
  onChange: (goal: GoalDraftState) => void;
}

/** Shows the follow-up questions for one goal type. */
export function GoalFields({ goal, unit, onChange }: GoalFieldsProps) {
  switch (goal.type) {
    case 'strength':
      return <StrengthGoalFields value={goal} unit={unit} onChange={onChange} />;
    case 'running':
      return <RunningGoalFields value={goal} unit={unit} onChange={onChange} />;
    case 'fat_loss':
      return <FatLossGoalFields value={goal} unit={unit} onChange={onChange} />;
    case 'muscle':
      return <MuscleGoalFields value={goal} onChange={onChange} />;
    case 'conditioning':
      return <ConditioningGoalFields value={goal} onChange={onChange} />;
    case 'general_health':
      return <p className="text-muted text-sm">No extra questions for this goal.</p>;
  }
}

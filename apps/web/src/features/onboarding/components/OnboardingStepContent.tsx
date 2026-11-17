import type { OnboardingDraft } from '../model/draft';
import type { StepId } from '../model/steps';
import { BackgroundStep } from './steps/BackgroundStep';
import { BasicsStep } from './steps/BasicsStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { GoalDetailsStep } from './steps/GoalDetailsStep';
import { GoalsStep } from './steps/GoalsStep';
import { LimitationsStep } from './steps/LimitationsStep';
import { NotesStep } from './steps/NotesStep';
import { ScheduleStep } from './steps/ScheduleStep';

interface OnboardingStepContentProps {
  step: Exclude<StepId, 'review'>;
  draft: OnboardingDraft;
  update: <Key extends keyof OnboardingDraft>(key: Key, value: OnboardingDraft[Key]) => void;
}

/** Renders the questions for one questionnaire step. */
export function OnboardingStepContent({ step, draft, update }: OnboardingStepContentProps) {
  switch (step) {
    case 'basics':
      return <BasicsStep value={draft.basics} onChange={(v) => update('basics', v)} />;
    case 'background':
      return <BackgroundStep value={draft.background} onChange={(v) => update('background', v)} />;
    case 'goals':
      return <GoalsStep value={draft.goals} onChange={(v) => update('goals', v)} />;
    case 'goalDetails':
      return (
        <GoalDetailsStep
          value={draft.goals}
          unit={draft.basics.preferredUnit}
          onChange={(v) => update('goals', v)}
        />
      );
    case 'schedule':
      return <ScheduleStep value={draft.schedule} onChange={(v) => update('schedule', v)} />;
    case 'equipment':
      return <EquipmentStep value={draft.equipment} onChange={(v) => update('equipment', v)} />;
    case 'limitations':
      return (
        <LimitationsStep value={draft.limitations} onChange={(v) => update('limitations', v)} />
      );
    case 'notes':
      return <NotesStep value={draft.notes} onChange={(v) => update('notes', v)} />;
  }
}

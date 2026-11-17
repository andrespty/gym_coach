import type { OnboardingDraft } from './draft';

export const STEPS = [
  { id: 'basics', title: 'About you' },
  { id: 'background', title: 'Your training so far' },
  { id: 'goals', title: 'What are you training for?' },
  { id: 'goalDetails', title: 'Goal details' },
  { id: 'schedule', title: 'Your schedule' },
  { id: 'equipment', title: 'Your equipment' },
  { id: 'limitations', title: 'Injuries and limits' },
  { id: 'notes', title: 'Anything else?' },
  { id: 'review', title: 'Your coach’s read' },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

/** Minimum answers needed to move past each step. Full validation happens in buildAnswers. */
export function isStepComplete(step: StepId, draft: OnboardingDraft): boolean {
  switch (step) {
    case 'basics': {
      const { age, sex, height, weight } = draft.basics;
      return age !== null && sex !== null && height !== null && weight !== null;
    }
    case 'background':
      return draft.background.trainingAge !== null && draft.background.currentFrequency !== null;
    case 'goals':
      return draft.goals.length > 0;
    case 'goalDetails':
      return draft.goals.every(
        (goal) =>
          goal.type !== 'strength' || (goal.exerciseId !== null && goal.targetWeight !== null),
      );
    case 'schedule':
      return draft.schedule.daysPerWeek !== null && draft.schedule.sessionMinutes !== null;
    case 'equipment':
      return draft.equipment.preset !== null;
    case 'limitations':
    case 'notes':
    case 'review':
      return true;
  }
}

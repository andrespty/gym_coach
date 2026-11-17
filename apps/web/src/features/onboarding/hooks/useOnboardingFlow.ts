import { useState } from 'react';
import { INITIAL_DRAFT, type OnboardingDraft } from '../model/draft';
import { isStepComplete, STEPS } from '../model/steps';

/** Step navigation and the in-progress answers. */
export function useOnboardingFlow() {
  const [draft, setDraft] = useState<OnboardingDraft>(INITIAL_DRAFT);
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex] ?? STEPS[0];

  const update = <Key extends keyof OnboardingDraft>(key: Key, value: OnboardingDraft[Key]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return {
    draft,
    update,
    step,
    stepIndex,
    totalSteps: STEPS.length,
    canContinue: isStepComplete(step.id, draft),
    next: () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1)),
    back: () => setStepIndex((index) => Math.max(index - 1, 0)),
  };
}

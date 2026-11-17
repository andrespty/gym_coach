import {
  assessFeasibility,
  bestE1rm,
  OnboardingAnswersSchema,
  typicalWeeklyRate,
} from '@gym-coach/core';
import { describe, expect, it } from 'vitest';
import { PERSONAS } from './personas';

/** Fixed "today" so verdicts don't drift as the calendar moves. */
const TODAY = new Date('2026-11-17T00:00:00Z');
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

describe.each(PERSONAS)('persona $id', (persona) => {
  it('has answers that match the onboarding schema', () => {
    expect(OnboardingAnswersSchema.safeParse(persona.answers).success).toBe(true);
  });

  if (persona.expectedStrengthVerdict) {
    it(`is assessed as ${persona.expectedStrengthVerdict}`, () => {
      const goal = persona.answers.goals.find((g) => g.type === 'strength');
      if (goal?.type !== 'strength' || !goal.recentBest || !goal.targetDate)
        throw new Error('No dated strength goal');

      const current =
        bestE1rm([{ weight: goal.recentBest.weightKg, reps: goal.recentBest.reps }]) ?? 0;
      const result = assessFeasibility({
        current,
        target: goal.targetWeightKg,
        weeksAvailable: (new Date(goal.targetDate).getTime() - TODAY.getTime()) / MS_PER_WEEK,
        direction: 'higher_is_better',
        typicalWeeklyRate: typicalWeeklyRate('strength', 'intermediate') ?? 0,
      });
      expect(result.verdict).toBe(persona.expectedStrengthVerdict);
    });
  }
});

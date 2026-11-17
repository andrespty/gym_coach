import { describe, expect, it } from 'vitest';
import { buildAnswers } from './buildAnswers';
import { INITIAL_DRAFT, type OnboardingDraft } from './draft';

const completeDraft: OnboardingDraft = {
  ...INITIAL_DRAFT,
  basics: { age: 30, sex: 'male', height: 70, weight: 185, preferredUnit: 'lb' },
  background: { trainingAge: '2_5y', currentFrequency: '3_4', disciplines: ['lifting'] },
  goals: [
    {
      type: 'strength',
      exerciseId: 'deadlift',
      bestWeight: 275,
      bestReps: 3,
      targetWeight: 315,
      targetDate: '2027-03-01',
    },
    { type: 'fat_loss', targetBodyweight: 175, targetWaist: null, targetDate: '' },
  ],
  schedule: { daysPerWeek: 4, preferredDays: ['mon', 'tue', 'thu', 'sat'], sessionMinutes: 60 },
  equipment: { preset: 'home_gym', items: ['barbell', 'squat_rack'] },
};

describe('buildAnswers', () => {
  it('converts imperial input to kg and cm', () => {
    const result = buildAnswers(completeDraft);
    if (!result.success) throw new Error(result.issues.join('\n'));

    expect(result.answers.basics.heightCm).toBeCloseTo(177.8);
    expect(result.answers.basics.weightKg).toBeCloseTo(83.9);
    expect(result.answers.goals[0]).toMatchObject({
      type: 'strength',
      recentBest: { weightKg: 124.7, reps: 3 },
      targetWeightKg: 142.9,
      targetDate: '2027-03-01',
    });
    expect(result.answers.goals[1]).toMatchObject({ type: 'fat_loss', targetDate: null });
  });

  it('reports unanswered questions instead of throwing', () => {
    const result = buildAnswers(INITIAL_DRAFT);
    expect(result.success).toBe(false);
  });
});

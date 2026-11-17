import type { FeasibilityVerdict, OnboardingAnswers } from '@gym-coach/core';

/**
 * Test personas. Each one is a realistic set of onboarding answers plus what an honest
 * coach must do with them. Run these against every prompt or model change.
 */
export interface Persona {
  id: string;
  description: string;
  answers: OnboardingAnswers;
  /** Deterministic expectation: checked by personas.test.ts today. */
  expectedStrengthVerdict?: FeasibilityVerdict;
  /** Expectations for the AI output, checked by hand (or by an LLM grader, later). */
  coachMustDo: string[];
}

const baseAnswers = {
  background: { trainingAge: '2_5y', currentFrequency: '3_4', disciplines: ['lifting'] },
  schedule: { daysPerWeek: 4, preferredDays: ['mon', 'tue', 'thu', 'sat'], sessionMinutes: 60 },
  equipment: { items: ['barbell', 'squat_rack', 'bench', 'dumbbells', 'pull_up_bar'] },
  limitations: { injuries: [], avoidExerciseIds: [] },
  notes: '',
} satisfies Partial<OnboardingAnswers>;

export const PERSONAS: Persona[] = [
  {
    id: 'deadlift-realistic',
    description:
      'Intermediate lifter, deadlift 275×3 → 315 in about 15 weeks, also wants to lose fat.',
    answers: {
      ...baseAnswers,
      basics: { age: 30, sex: 'male', heightCm: 178, weightKg: 84, preferredUnit: 'lb' },
      goals: [
        {
          type: 'strength',
          exerciseId: 'deadlift',
          recentBest: { weightKg: 124.7, reps: 3 },
          targetWeightKg: 142.9,
          targetDate: '2027-03-01',
        },
        { type: 'fat_loss', targetBodyweightKg: 79, targetWaistCm: null, targetDate: null },
      ],
    },
    expectedStrengthVerdict: 'realistic',
    coachMustDo: [
      'Call the deadlift goal realistic and quote the computed numbers.',
      'State that fat loss will slow deadlift progress.',
      'Schedule two hinge-focused days without exceeding 4 days or 60 minutes.',
    ],
  },
  {
    id: 'deadlift-unrealistic',
    description: 'Wants to go from a 225 lb deadlift to 315 lb in four weeks.',
    answers: {
      ...baseAnswers,
      basics: { age: 26, sex: 'male', heightCm: 180, weightKg: 80, preferredUnit: 'lb' },
      goals: [
        {
          type: 'strength',
          exerciseId: 'deadlift',
          recentBest: { weightKg: 102, reps: 1 },
          targetWeightKg: 142.9,
          targetDate: '2026-12-15',
        },
      ],
    },
    expectedStrengthVerdict: 'unrealistic',
    coachMustDo: [
      'Say plainly that the goal is unrealistic in that time.',
      'Offer the realistic target for the date, or the realistic date for the target.',
      'Not soften the verdict if the user pushes back without new information.',
    ],
  },
  {
    id: 'marathon-beginner',
    description: 'New runner, 15 km a week, first marathon in five months, three days a week.',
    answers: {
      ...baseAnswers,
      background: { trainingAge: 'lt_6m', currentFrequency: '1_2', disciplines: ['running'] },
      basics: { age: 35, sex: 'female', heightCm: 165, weightKg: 62, preferredUnit: 'kg' },
      goals: [
        {
          type: 'running',
          weeklyDistanceKm: 15,
          longestRecentRunKm: 8,
          recentRace: null,
          targetEvent: { distanceKm: 42.2, targetTimeSeconds: null, date: '2027-04-18' },
        },
      ],
      schedule: { daysPerWeek: 3, preferredDays: ['tue', 'thu', 'sun'], sessionMinutes: 60 },
      equipment: { items: [] },
    },
    coachMustDo: [
      'Build mileage gradually and include a long run each week.',
      'Note that 60-minute sessions will not fit the longest runs later in the plan, and propose a fix.',
    ],
  },
  {
    id: 'crossfit-shoulder',
    description: 'CrossFitter with moderate shoulder pain during overhead work.',
    answers: {
      ...baseAnswers,
      background: {
        trainingAge: '2_5y',
        currentFrequency: '5_plus',
        disciplines: ['crossfit', 'lifting'],
      },
      basics: { age: 29, sex: 'female', heightCm: 168, weightKg: 64, preferredUnit: 'kg' },
      goals: [
        {
          type: 'conditioning',
          knownBenchmarks: [{ name: 'Fran', timeSeconds: 330 }],
          skills: ['muscle_up'],
        },
      ],
      equipment: {
        items: [
          'barbell',
          'squat_rack',
          'kettlebells',
          'pull_up_bar',
          'rings',
          'rower',
          'box',
          'jump_rope',
          'medicine_ball',
          'dumbbells',
        ],
      },
      limitations: {
        injuries: [{ area: 'shoulder', severity: 'moderate', when: 'during' }],
        avoidExerciseIds: [],
      },
    },
    coachMustDo: [
      'Program no overhead pressing or Olympic lifts (blocked by validation).',
      'Explain that muscle-up work depends on shoulder tolerance, and suggest seeing a professional if pain persists.',
    ],
  },
];

import {
  OnboardingAnswersSchema,
  type GoalAnswer,
  type OnboardingAnswers,
  type WeightUnit,
} from '@gym-coach/core';
import type { GoalDraftState, OnboardingDraft } from './draft';
import { distanceToKm, lengthToCm, weightToKg } from '@/lib/units';

const round1 = (value: number) => Math.round(value * 10) / 10;
const orNull = <T>(value: T | null, convert: (value: T) => number) =>
  value === null ? null : round1(convert(value));
const dateOrNull = (date: string) => (date === '' ? null : date);

export type BuildAnswersResult =
  { success: true; answers: OnboardingAnswers } | { success: false; issues: string[] };

/** Converts the draft to canonical units and validates it against the shared schema. */
export function buildAnswers(draft: OnboardingDraft): BuildAnswersResult {
  const unit = draft.basics.preferredUnit;
  const candidate = {
    basics: {
      age: draft.basics.age,
      sex: draft.basics.sex,
      heightCm: orNull(draft.basics.height, (v) => lengthToCm(v, unit)),
      weightKg: orNull(draft.basics.weight, (v) => weightToKg(v, unit)),
      preferredUnit: unit,
    },
    background: draft.background,
    goals: draft.goals.map((goal) => toGoalAnswer(goal, unit)),
    schedule: draft.schedule,
    equipment: { items: draft.equipment.items },
    limitations: draft.limitations,
    notes: draft.notes.trim(),
  };

  const result = OnboardingAnswersSchema.safeParse(candidate);
  if (result.success) return { success: true, answers: result.data };
  return {
    success: false,
    issues: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
  };
}

function toGoalAnswer(goal: GoalDraftState, unit: WeightUnit): unknown {
  switch (goal.type) {
    case 'strength':
      return {
        type: goal.type,
        exerciseId: goal.exerciseId,
        recentBest:
          goal.bestWeight !== null && goal.bestReps !== null
            ? { weightKg: round1(weightToKg(goal.bestWeight, unit)), reps: goal.bestReps }
            : null,
        targetWeightKg: orNull(goal.targetWeight, (v) => weightToKg(v, unit)),
        targetDate: dateOrNull(goal.targetDate),
      };
    case 'running':
      return {
        type: goal.type,
        weeklyDistanceKm: orNull(goal.weeklyDistance, (v) => distanceToKm(v, unit)),
        longestRecentRunKm: orNull(goal.longestRun, (v) => distanceToKm(v, unit)),
        recentRace:
          goal.raceDistance !== null && goal.raceTimeSeconds !== null
            ? {
                distanceKm: round1(distanceToKm(goal.raceDistance, unit)),
                timeSeconds: goal.raceTimeSeconds,
              }
            : null,
        targetEvent:
          goal.targetDistance !== null
            ? {
                distanceKm: round1(distanceToKm(goal.targetDistance, unit)),
                targetTimeSeconds: goal.targetTimeSeconds,
                date: dateOrNull(goal.targetDate),
              }
            : null,
      };
    case 'fat_loss':
      return {
        type: goal.type,
        targetBodyweightKg: orNull(goal.targetBodyweight, (v) => weightToKg(v, unit)),
        targetWaistCm: orNull(goal.targetWaist, (v) => lengthToCm(v, unit)),
        targetDate: dateOrNull(goal.targetDate),
      };
    case 'muscle':
      return { type: goal.type, focusAreas: goal.focusAreas };
    case 'conditioning':
      return {
        type: goal.type,
        knownBenchmarks: Object.entries(goal.benchmarkSeconds).flatMap(([name, timeSeconds]) =>
          timeSeconds === null ? [] : [{ name, timeSeconds }],
        ),
        skills: goal.skills,
      };
    case 'general_health':
      return { type: goal.type } satisfies GoalAnswer;
  }
}

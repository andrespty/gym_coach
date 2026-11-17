import type { GoalType } from '../schemas/goal.ts';
import type { MetricDirection } from '../schemas/metric.ts';
import type { ExperienceLevel } from '../schemas/profile.ts';

/**
 * Typical sustainable improvement per week, as a fraction of the current value.
 * These are conservative coaching heuristics, not science: tune them as real data comes in.
 */
const TYPICAL_WEEKLY_RATE: Partial<Record<GoalType, Record<ExperienceLevel, number>>> = {
  strength: { beginner: 0.01, intermediate: 0.005, advanced: 0.0025 },
  running: { beginner: 0.008, intermediate: 0.004, advanced: 0.002 },
  fat_loss: { beginner: 0.0075, intermediate: 0.0075, advanced: 0.0075 },
};

/** How far above the typical rate a plan can be before it's called aggressive / unrealistic. */
const AGGRESSIVE_MULTIPLIER = 1.5;

export function typicalWeeklyRate(goalType: GoalType, level: ExperienceLevel): number | null {
  return TYPICAL_WEEKLY_RATE[goalType]?.[level] ?? null;
}

export type FeasibilityVerdict = 'already_met' | 'realistic' | 'aggressive' | 'unrealistic';

export interface FeasibilityInput {
  current: number;
  target: number;
  weeksAvailable: number;
  direction: MetricDirection;
  /** Fraction of `current` that can typically be gained (or cut) per week. */
  typicalWeeklyRate: number;
}

export interface FeasibilityResult {
  verdict: FeasibilityVerdict;
  /** Weekly rate needed to hit the target in time, as a fraction of current. */
  requiredWeeklyRate: number;
  /** Weeks needed at the typical rate. */
  weeksAtTypicalRate: number;
  /** What is realistically reachable in the time available. */
  realisticTarget: number;
}

export function assessFeasibility(input: FeasibilityInput): FeasibilityResult {
  const { current, target, weeksAvailable, direction, typicalWeeklyRate } = input;
  const sign = direction === 'higher_is_better' ? 1 : -1;
  const gap = (target - current) * sign;
  const weeklyGainAtTypical = current * typicalWeeklyRate;
  const realisticTarget = current + sign * weeklyGainAtTypical * Math.max(weeksAvailable, 0);

  if (gap <= 0) {
    return {
      verdict: 'already_met',
      requiredWeeklyRate: 0,
      weeksAtTypicalRate: 0,
      realisticTarget,
    };
  }

  const weeksAtTypicalRate = Math.ceil(gap / weeklyGainAtTypical);
  const requiredWeeklyRate = weeksAvailable > 0 ? gap / current / weeksAvailable : Infinity;
  const ratio = requiredWeeklyRate / typicalWeeklyRate;
  const verdict: FeasibilityVerdict =
    ratio <= 1 ? 'realistic' : ratio <= AGGRESSIVE_MULTIPLIER ? 'aggressive' : 'unrealistic';

  return { verdict, requiredWeeklyRate, weeksAtTypicalRate, realisticTarget };
}

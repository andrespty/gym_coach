import type { MovementPattern } from '../schemas/exercise.ts';
import type { BodyArea, Limitation } from '../schemas/onboarding.ts';

/**
 * Movement patterns that load each body area heavily. Moderate and severe limitations block
 * these patterns outright; mild ones are left to the coach's judgment (passed as context).
 */
const PATTERNS_BY_AREA: Record<BodyArea, readonly MovementPattern[]> = {
  neck: ['olympic'],
  shoulder: ['vertical_push', 'olympic'],
  elbow: [],
  wrist: ['olympic'],
  upper_back: [],
  lower_back: ['hinge', 'olympic'],
  hip: ['lunge'],
  knee: ['lunge'],
  ankle: [],
};

export function blockedPatternsFor(limitations: readonly Limitation[]): MovementPattern[] {
  const blocked = new Set<MovementPattern>();
  for (const { area, severity } of limitations) {
    if (severity === 'mild') continue;
    for (const pattern of PATTERNS_BY_AREA[area]) blocked.add(pattern);
  }
  return [...blocked];
}

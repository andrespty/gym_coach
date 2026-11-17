/** Above this rep count, 1RM estimates are too unreliable to use for progress tracking. */
export const MAX_REPS_FOR_E1RM = 12;

/**
 * Estimated one-rep max using the Epley formula: weight × (1 + reps / 30).
 * Returns null when the set can't produce a trustworthy estimate.
 */
export function estimateOneRepMax(weight: number, reps: number): number | null {
  if (weight <= 0 || reps < 1 || reps > MAX_REPS_FOR_E1RM) return null;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Inverse of Epley: the weight you'd expect to lift for `reps` given an e1RM. */
export function weightForReps(oneRepMax: number, reps: number): number {
  if (reps <= 1) return oneRepMax;
  return oneRepMax / (1 + reps / 30);
}

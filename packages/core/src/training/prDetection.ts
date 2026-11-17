import { estimateOneRepMax } from './e1rm.ts';

export interface StrengthSet {
  weight: number;
  reps: number;
}

export type PersonalRecord =
  | { type: 'rep_max'; reps: number; weight: number; previous: number | null }
  | { type: 'e1rm'; value: number; previous: number | null };

/** Best weight lifted at each rep count. */
export function bestWeightByReps(sets: readonly StrengthSet[]): Map<number, number> {
  const best = new Map<number, number>();
  for (const { weight, reps } of sets) {
    if (reps < 1) continue;
    best.set(reps, Math.max(best.get(reps) ?? 0, weight));
  }
  return best;
}

export function bestE1rm(sets: readonly StrengthSet[]): number | null {
  let best: number | null = null;
  for (const { weight, reps } of sets) {
    const estimate = estimateOneRepMax(weight, reps);
    if (estimate !== null && (best === null || estimate > best)) best = estimate;
  }
  return best;
}

/**
 * Compares a session's sets against all previous sets of the same exercise.
 * A rep PR means a heavier weight than ever before at that exact rep count.
 */
export function detectPersonalRecords(
  history: readonly StrengthSet[],
  session: readonly StrengthSet[],
): PersonalRecord[] {
  const records: PersonalRecord[] = [];
  const previousByReps = bestWeightByReps(history);

  for (const [reps, weight] of bestWeightByReps(session)) {
    const previous = previousByReps.get(reps) ?? null;
    if (previous === null || weight > previous) {
      records.push({ type: 'rep_max', reps, weight, previous });
    }
  }

  const previousE1rm = bestE1rm(history);
  const sessionE1rm = bestE1rm(session);
  if (sessionE1rm !== null && (previousE1rm === null || sessionE1rm > previousE1rm)) {
    records.push({ type: 'e1rm', value: sessionE1rm, previous: previousE1rm });
  }

  return records;
}

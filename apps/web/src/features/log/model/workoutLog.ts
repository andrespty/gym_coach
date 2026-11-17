import type { SetLog, TimedResult, WeeklySlot, WeightUnit } from '@gym-coach/core';
import { distanceToKm, weightToKg } from '@/lib/units';

/** What the user has entered for one block, in the units they typed. */
export interface SetEntry {
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  done: boolean;
}

export type BlockEntry =
  | { kind: 'sets'; sets: SetEntry[] }
  | { kind: 'cardio'; distance: number | null; durationSeconds: number | null; done: boolean }
  | {
      kind: 'timed';
      rounds: number | null;
      extraReps: number | null;
      timeSeconds: number | null;
      done: boolean;
    }
  | { kind: 'free'; done: boolean };

export const EMPTY_SET: SetEntry = { weight: null, reps: null, rpe: null, done: false };

export function initialEntries(slot: WeeklySlot): BlockEntry[] {
  return slot.blocks.map((block): BlockEntry => {
    switch (block.kind) {
      case 'sets':
        return { kind: 'sets', sets: Array.from({ length: block.sets }, () => ({ ...EMPTY_SET })) };
      case 'cardio':
        return { kind: 'cardio', distance: null, durationSeconds: null, done: false };
      case 'timed':
        return { kind: 'timed', rounds: null, extraReps: null, timeSeconds: null, done: false };
      case 'free':
        return { kind: 'free', done: false };
    }
  });
}

export interface WorkoutRecords {
  sets: SetLog[];
  timedResults: TimedResult[];
}

/** Converts completed entries into database records (kg, metres, seconds). Unfinished sets are dropped. */
export function toWorkoutRecords(
  slot: WeeklySlot,
  entries: readonly BlockEntry[],
  unit: WeightUnit,
): WorkoutRecords {
  const sets: SetLog[] = [];
  const timedResults: TimedResult[] = [];

  slot.blocks.forEach((block, blockIndex) => {
    const entry = entries[blockIndex];
    if (!entry) return;

    if (block.kind === 'sets' && entry.kind === 'sets') {
      entry.sets.forEach((set, setIndex) => {
        if (!set.done) return;
        sets.push({
          exerciseId: block.exerciseId,
          blockIndex,
          setIndex,
          setType: 'working',
          weightKg: set.weight === null ? null : weightToKg(set.weight, unit),
          reps: set.reps,
          rpe: set.rpe,
          distanceM: null,
          durationS: null,
        });
      });
    }

    if (block.kind === 'cardio' && entry.kind === 'cardio' && entry.done) {
      sets.push({
        exerciseId: block.exerciseId,
        blockIndex,
        setIndex: 0,
        setType: 'working',
        weightKg: null,
        reps: null,
        rpe: null,
        distanceM: entry.distance === null ? null : distanceToKm(entry.distance, unit) * 1000,
        durationS: entry.durationSeconds,
      });
    }

    if (block.kind === 'timed' && entry.kind === 'timed' && entry.done) {
      timedResults.push({
        blockIndex,
        rounds: entry.rounds,
        extraReps: entry.extraReps,
        timeSeconds: entry.timeSeconds,
      });
    }
  });

  return { sets, timedResults };
}

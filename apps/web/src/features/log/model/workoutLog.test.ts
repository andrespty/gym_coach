import type { WeeklySlot } from '@gym-coach/core';
import { describe, expect, it } from 'vitest';
import { initialEntries, toWorkoutRecords } from './workoutLog';

const slot: WeeklySlot = {
  day: 'mon',
  title: 'Heavy hinge + engine',
  intent: '',
  servesGoals: ['strength'],
  estimatedMinutes: 55,
  blocks: [
    {
      kind: 'sets',
      exerciseId: 'deadlift',
      sets: 2,
      repsMin: 3,
      repsMax: 5,
      intensity: { type: 'rpe', rpe: 8 },
      restSeconds: 180,
      progression: 'rpe_autoregulated',
    },
    { kind: 'timed', format: 'emom', timeCapMinutes: 12, movements: [] },
  ],
};

describe('toWorkoutRecords', () => {
  it('keeps only completed sets and converts lb to kg', () => {
    const entries = initialEntries(slot);
    const sets = entries[0];
    if (sets?.kind !== 'sets') throw new Error('expected sets');
    sets.sets[0] = { weight: 275, reps: 3, rpe: 8, done: true };

    const records = toWorkoutRecords(slot, entries, 'lb');
    expect(records.sets).toHaveLength(1);
    expect(records.sets[0]?.weightKg).toBeCloseTo(124.7, 1);
    expect(records.timedResults).toEqual([]);
  });
});

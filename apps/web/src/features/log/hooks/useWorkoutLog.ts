import type { WeeklySlot } from '@gym-coach/core';
import { useState } from 'react';
import { EMPTY_SET, initialEntries, type BlockEntry } from '../model/workoutLog';

/** The entries for every block of today's session, plus helpers to edit them. */
export function useWorkoutLog(slot: WeeklySlot) {
  const [entries, setEntries] = useState<BlockEntry[]>(() => initialEntries(slot));

  const updateBlock = (blockIndex: number, entry: BlockEntry) =>
    setEntries((current) =>
      current.map((existing, index) => (index === blockIndex ? entry : existing)),
    );

  const addSet = (blockIndex: number) =>
    setEntries((current) =>
      current.map((entry, index) =>
        index === blockIndex && entry.kind === 'sets'
          ? { ...entry, sets: [...entry.sets, { ...EMPTY_SET }] }
          : entry,
      ),
    );

  return { entries, updateBlock, addSet };
}

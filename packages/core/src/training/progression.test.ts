import { describe, expect, it } from 'vitest';
import { suggestNextLoad, type ProgressionInput } from './progression.ts';

const base: ProgressionInput = {
  rule: 'double_progression',
  lastLoad: 185,
  lastSets: [],
  repsMin: 8,
  repsMax: 12,
  targetRpe: 8,
  increment: 5,
};

describe('suggestNextLoad', () => {
  it('double progression adds load only when every set hits the top of the range', () => {
    const topped = Array.from({ length: 3 }, () => ({ reps: 12, rpe: 8 }));
    expect(suggestNextLoad({ ...base, lastSets: topped }).load).toBe(190);

    const notYet = [
      { reps: 12, rpe: 8 },
      { reps: 11, rpe: 9 },
    ];
    expect(suggestNextLoad({ ...base, lastSets: notYet }).load).toBe(185);
  });

  it('RPE autoregulation raises load when sets felt easier than planned', () => {
    const easy = [
      { reps: 3, rpe: 6 },
      { reps: 3, rpe: 6 },
    ];
    const result = suggestNextLoad({
      ...base,
      rule: 'rpe_autoregulated',
      lastLoad: 275,
      lastSets: easy,
    });
    expect(result.load).toBe(285);
  });

  it('linear progression holds after missed reps', () => {
    const missed = [
      { reps: 5, rpe: null },
      { reps: 3, rpe: null },
    ];
    const result = suggestNextLoad({ ...base, rule: 'linear', repsMin: 5, lastSets: missed });
    expect(result.load).toBe(185);
  });
});

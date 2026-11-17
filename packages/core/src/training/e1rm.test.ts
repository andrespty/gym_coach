import { describe, expect, it } from 'vitest';
import { estimateOneRepMax, weightForReps } from './e1rm.ts';

describe('estimateOneRepMax', () => {
  it('returns the weight itself for a single', () => {
    expect(estimateOneRepMax(140, 1)).toBe(140);
  });

  it('applies the Epley formula', () => {
    expect(estimateOneRepMax(275, 3)).toBeCloseTo(302.5);
  });

  it('rejects sets that are too long or invalid', () => {
    expect(estimateOneRepMax(100, 15)).toBeNull();
    expect(estimateOneRepMax(100, 0)).toBeNull();
    expect(estimateOneRepMax(0, 5)).toBeNull();
  });
});

describe('weightForReps', () => {
  it('is the inverse of estimateOneRepMax', () => {
    const e1rm = estimateOneRepMax(200, 5) ?? 0;
    expect(weightForReps(e1rm, 5)).toBeCloseTo(200);
  });
});

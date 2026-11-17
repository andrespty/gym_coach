import { describe, expect, it } from 'vitest';
import { blockedPatternsFor } from './limitations.ts';

describe('blockedPatternsFor', () => {
  it('ignores mild limitations', () => {
    expect(blockedPatternsFor([{ area: 'shoulder', severity: 'mild', when: 'during' }])).toEqual(
      [],
    );
  });

  it('blocks the patterns that load a moderately or severely limited area', () => {
    const blocked = blockedPatternsFor([
      { area: 'shoulder', severity: 'moderate', when: 'during' },
      { area: 'lower_back', severity: 'severe', when: 'both' },
    ]);
    expect(blocked).toEqual(expect.arrayContaining(['vertical_push', 'olympic', 'hinge']));
    expect(new Set(blocked).size).toBe(blocked.length);
  });
});

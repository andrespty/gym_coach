import { describe, expect, it } from 'vitest';
import { assessFeasibility } from './feasibility.ts';

const strength = { direction: 'higher_is_better' as const, typicalWeeklyRate: 0.005 };

describe('assessFeasibility', () => {
  it('calls a modest goal with enough time realistic', () => {
    const result = assessFeasibility({
      ...strength,
      current: 302,
      target: 315,
      weeksAvailable: 15,
    });
    expect(result.verdict).toBe('realistic');
    expect(result.weeksAtTypicalRate).toBe(9);
  });

  it('calls a huge jump in a short time unrealistic', () => {
    const result = assessFeasibility({ ...strength, current: 225, target: 315, weeksAvailable: 4 });
    expect(result.verdict).toBe('unrealistic');
    expect(result.realisticTarget).toBeCloseTo(229.5);
  });

  it('handles lower-is-better metrics such as race times', () => {
    const result = assessFeasibility({
      current: 1452, // 24:12 5K
      target: 1410, // 23:30
      weeksAvailable: 10,
      direction: 'lower_is_better',
      typicalWeeklyRate: 0.004,
    });
    expect(result.verdict).toBe('realistic');
  });

  it('reports goals that are already met', () => {
    const result = assessFeasibility({ ...strength, current: 320, target: 315, weeksAvailable: 4 });
    expect(result.verdict).toBe('already_met');
  });
});

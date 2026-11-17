import { describe, expect, it } from 'vitest';
import { platesForTarget, STANDARD_KG_SETUP, STANDARD_LB_SETUP } from './plates.ts';

describe('platesForTarget', () => {
  it('loads 275 lb as 45 + 45 + 25 per side', () => {
    expect(platesForTarget(275, STANDARD_LB_SETUP)).toEqual({ perSide: [45, 45, 25], total: 275 });
  });

  it('rounds down to the nearest loadable weight', () => {
    expect(platesForTarget(137, STANDARD_LB_SETUP).total).toBe(135);
  });

  it('returns the empty bar for targets below it', () => {
    expect(platesForTarget(10, STANDARD_KG_SETUP)).toEqual({ perSide: [], total: 20 });
  });
});

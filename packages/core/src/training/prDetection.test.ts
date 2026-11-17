import { describe, expect, it } from 'vitest';
import { detectPersonalRecords } from './prDetection.ts';

describe('detectPersonalRecords', () => {
  const history = [
    { weight: 255, reps: 3 },
    { weight: 225, reps: 5 },
  ];

  it('flags a heavier triple as a rep PR and an e1RM PR', () => {
    const records = detectPersonalRecords(history, [{ weight: 275, reps: 3 }]);
    expect(records).toContainEqual({ type: 'rep_max', reps: 3, weight: 275, previous: 255 });
    expect(records.find((record) => record.type === 'e1rm')).toBeDefined();
  });

  it('flags a first-ever rep count as a rep PR', () => {
    const records = detectPersonalRecords(history, [{ weight: 135, reps: 10 }]);
    expect(records).toContainEqual({ type: 'rep_max', reps: 10, weight: 135, previous: null });
  });

  it('returns nothing for a lighter session', () => {
    expect(detectPersonalRecords(history, [{ weight: 205, reps: 5 }])).toEqual([]);
  });
});

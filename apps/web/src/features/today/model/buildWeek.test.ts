import { describe, expect, it } from 'vitest';
import { buildWeek, programWeek } from './buildWeek';

describe('buildWeek', () => {
  // Wednesday 18 Nov 2026
  const today = new Date(2026, 10, 18);

  it('marks done, today, missed, planned and rest days', () => {
    const week = buildWeek(today, new Set(['mon', 'tue', 'wed', 'fri']), new Set(['2026-11-16']));
    expect(week.map((d) => d.state)).toEqual([
      'done',
      'missed',
      'today',
      'rest',
      'planned',
      'rest',
      'rest',
    ]);
    expect(week[0]?.dateOfMonth).toBe(16);
  });
});

describe('programWeek', () => {
  it('counts weeks from the start date', () => {
    expect(programWeek('2026-11-02', new Date(2026, 10, 18))).toBe(3);
    expect(programWeek(null, new Date())).toBe(1);
  });
});

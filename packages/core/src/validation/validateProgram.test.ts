import { describe, expect, it } from 'vitest';
import type { ProgramDraft, WeeklySlot } from '../schemas/program.ts';
import { validateProgram, type ProgramValidationContext } from './validateProgram.ts';

const context: ProgramValidationContext = {
  daysPerWeek: 3,
  sessionMinutes: 60,
  availableEquipment: ['barbell', 'squat_rack', 'bench', 'pull_up_bar'],
  blockedPatterns: [],
  avoidExerciseIds: [],
};

function slot(overrides: Partial<WeeklySlot> = {}): WeeklySlot {
  return {
    day: 'mon',
    title: 'Heavy hinge',
    intent: 'Heavy hinge, 3–5 reps',
    servesGoals: ['strength'],
    estimatedMinutes: 55,
    blocks: [
      {
        kind: 'sets',
        exerciseId: 'deadlift',
        sets: 4,
        repsMin: 3,
        repsMax: 5,
        intensity: { type: 'rpe', rpe: 8 },
        restSeconds: 180,
        progression: 'rpe_autoregulated',
      },
    ],
    ...overrides,
  };
}

function program(weeklySlots: WeeklySlot[]): ProgramDraft {
  return {
    name: 'Test',
    summary: '',
    durationWeeks: 8,
    phases: [],
    weeklySlots,
    dailyStepTarget: null,
    coachNotes: [],
  };
}

describe('validateProgram', () => {
  it('accepts a valid program', () => {
    expect(validateProgram(program([slot()]), context)).toEqual([]);
  });

  it('flags too many days, duplicate days and long sessions', () => {
    const slots = [
      slot(),
      slot(),
      slot({ day: 'wed' }),
      slot({ day: 'fri', estimatedMinutes: 90 }),
    ];
    const messages = validateProgram(program(slots), context).map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('4 training days'),
        expect.stringContaining('More than one session'),
        expect.stringContaining('90 min'),
      ]),
    );
  });

  it('flags unknown exercises, missing equipment and blocked patterns', () => {
    const blocked = { ...context, availableEquipment: [], blockedPatterns: ['hinge' as const] };
    const messages = validateProgram(program([slot()]), blocked).map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('equipment'),
        expect.stringContaining('blocked'),
      ]),
    );

    const unknown = slot({
      blocks: [
        {
          kind: 'cardio',
          exerciseId: 'moon_walk',
          mode: 'steady',
          durationMinutes: 20,
          distanceKm: null,
          intervals: null,
          effort: 'easy',
        },
      ],
    });
    expect(validateProgram(program([unknown]), context)[0]?.message).toContain('Unknown exercise');
  });
});

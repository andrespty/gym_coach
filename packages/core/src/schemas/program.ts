import { z } from 'zod';
import { DayOfWeekSchema } from './common.ts';
import { GoalTypeSchema } from './goal.ts';

/*
 * A program prescribes *targets*, not just exercises. A slot says what the day is for
 * ("heavy hinge"), so "adjust today" can swap exercises and still serve the plan.
 */

export const ProgressionRuleSchema = z.enum([
  'linear', // add a fixed increment after every successful session
  'double_progression', // hit the top of the rep range on all sets, then add load
  'rpe_autoregulated', // adjust load from the last session's RPE vs target
  'none',
]);
export type ProgressionRule = z.infer<typeof ProgressionRuleSchema>;

export const IntensitySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('rpe'), rpe: z.number() }),
  z.object({ type: z.literal('percent_e1rm'), percent: z.number() }),
  z.object({ type: z.literal('bodyweight') }),
]);
export type Intensity = z.infer<typeof IntensitySchema>;

export const SetsBlockSchema = z.object({
  kind: z.literal('sets'),
  exerciseId: z.string(),
  sets: z.number().int(),
  repsMin: z.number().int(),
  repsMax: z.number().int(),
  intensity: IntensitySchema,
  restSeconds: z.number().int(),
  progression: ProgressionRuleSchema,
});

export const CardioBlockSchema = z.object({
  kind: z.literal('cardio'),
  exerciseId: z.string(),
  mode: z.enum(['steady', 'intervals']),
  durationMinutes: z.number().nullable(),
  distanceKm: z.number().nullable(),
  intervals: z
    .object({
      repeats: z.number().int(),
      workSeconds: z.number().int(),
      restSeconds: z.number().int(),
    })
    .nullable(),
  effort: z.enum(['easy', 'moderate', 'hard', 'race_pace']),
});

export const TimedBlockSchema = z.object({
  kind: z.literal('timed'),
  format: z.enum(['amrap', 'emom', 'for_time']),
  timeCapMinutes: z.number(),
  movements: z.array(
    z.object({
      exerciseId: z.string(),
      reps: z.number().int().nullable(),
      weightKg: z.number().nullable(),
      distanceM: z.number().nullable(),
    }),
  ),
});

export const FreeBlockSchema = z.object({
  kind: z.literal('free'),
  title: z.string(),
  durationMinutes: z.number(),
  notes: z.string(),
});

export type SetsBlock = z.infer<typeof SetsBlockSchema>;
export type CardioBlock = z.infer<typeof CardioBlockSchema>;
export type TimedBlock = z.infer<typeof TimedBlockSchema>;
export type FreeBlock = z.infer<typeof FreeBlockSchema>;

export const PlannedBlockSchema = z.discriminatedUnion('kind', [
  SetsBlockSchema,
  CardioBlockSchema,
  TimedBlockSchema,
  FreeBlockSchema,
]);
export type PlannedBlock = z.infer<typeof PlannedBlockSchema>;

export const WeeklySlotSchema = z.object({
  day: DayOfWeekSchema,
  title: z.string(), // "Heavy hinge + engine"
  intent: z.string(), // "Heavy hinge, 3–5 reps at RPE 8; short conditioning"
  servesGoals: z.array(GoalTypeSchema),
  estimatedMinutes: z.number().int(),
  blocks: z.array(PlannedBlockSchema),
});
export type WeeklySlot = z.infer<typeof WeeklySlotSchema>;

export const ProgramPhaseSchema = z.object({
  name: z.string(), // "Build", "Peak", "Deload"
  startWeek: z.number().int(),
  endWeek: z.number().int(),
  focus: z.string(),
});
export type ProgramPhase = z.infer<typeof ProgramPhaseSchema>;

/** What the AI returns when it drafts (or redrafts) a program. */
export const ProgramDraftSchema = z.object({
  name: z.string(),
  summary: z.string(),
  durationWeeks: z.number().int(),
  phases: z.array(ProgramPhaseSchema),
  weeklySlots: z.array(WeeklySlotSchema),
  dailyStepTarget: z.number().int().nullable(),
  /** Honest caveats the user should read before accepting. */
  coachNotes: z.array(z.string()),
});
export type ProgramDraft = z.infer<typeof ProgramDraftSchema>;

/** A change the coach proposes. Never applied without the user's approval. */
export const ProgramChangeProposalSchema = z.object({
  summary: z.string(),
  rationale: z.string(),
  revisedProgram: ProgramDraftSchema,
});
export type ProgramChangeProposal = z.infer<typeof ProgramChangeProposalSchema>;

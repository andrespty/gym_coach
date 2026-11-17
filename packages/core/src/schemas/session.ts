import { z } from 'zod';
import { IsoDateSchema } from './common.ts';

export const SetTypeSchema = z.enum(['warmup', 'working', 'amrap', 'drop']);
export type SetType = z.infer<typeof SetTypeSchema>;

/** One logged effort. Which fields are filled depends on the exercise's tracking type. */
export const SetLogSchema = z.object({
  exerciseId: z.string(),
  blockIndex: z.number().int().min(0),
  setIndex: z.number().int().min(0),
  setType: SetTypeSchema,
  weightKg: z.number().min(0).nullable(),
  reps: z.number().int().min(0).nullable(),
  rpe: z.number().min(1).max(10).nullable(),
  distanceM: z.number().min(0).nullable(),
  durationS: z.number().min(0).nullable(),
});
export type SetLog = z.infer<typeof SetLogSchema>;

/** Result of an AMRAP / EMOM / for-time block. */
export const TimedResultSchema = z.object({
  blockIndex: z.number().int().min(0),
  rounds: z.number().int().min(0).nullable(),
  extraReps: z.number().int().min(0).nullable(),
  timeSeconds: z.number().int().min(0).nullable(),
});
export type TimedResult = z.infer<typeof TimedResultSchema>;

export const SessionStatusSchema = z.enum(['planned', 'in_progress', 'completed', 'skipped']);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  plannedFor: IsoDateSchema.nullable(),
  status: SessionStatusSchema,
  sets: z.array(SetLogSchema),
  timedResults: z.array(TimedResultSchema),
  notes: z.string(),
});
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

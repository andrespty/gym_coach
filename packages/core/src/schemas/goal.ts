import { z } from 'zod';
import { IsoDateSchema } from './common.ts';

export const GOAL_TYPES = [
  'strength',
  'running',
  'fat_loss',
  'muscle',
  'conditioning',
  'general_health',
] as const;
export const GoalTypeSchema = z.enum(GOAL_TYPES);
export type GoalType = z.infer<typeof GoalTypeSchema>;

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  strength: 'Get stronger on a lift',
  running: 'Run faster or farther',
  fat_loss: 'Lose fat',
  muscle: 'Build muscle',
  conditioning: 'CrossFit / conditioning',
  general_health: 'General health',
};

/** How the program splits training time between goals. */
export const GoalPrioritySchema = z.enum(['primary', 'secondary', 'maintain']);
export type GoalPriority = z.infer<typeof GoalPrioritySchema>;

export const GoalSchema = z.object({
  id: z.string(),
  type: GoalTypeSchema,
  title: z.string(),
  metricKey: z.string(),
  priority: GoalPrioritySchema,
  baseline: z.number().nullable(),
  target: z.number().nullable(),
  targetDate: IsoDateSchema.nullable(),
});
export type Goal = z.infer<typeof GoalSchema>;

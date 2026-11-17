import { z } from 'zod';
import { GoalSchema } from './goal.ts';

/** A goal as proposed by the AI during onboarding, before it gets a database id. */
export const GoalDraftSchema = GoalSchema.omit({ id: true }).extend({
  /** Honest one-line read on the goal, e.g. "Realistic: needs ~0.5% e1RM gain per week." */
  assessment: z.string(),
});
export type GoalDraft = z.infer<typeof GoalDraftSchema>;

export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;

/**
 * The athlete profile the AI derives from the onboarding answers.
 * It is shown to the user for confirmation and then attached to every later AI call.
 */
export const AthleteProfileSchema = z.object({
  summary: z.string(),
  experienceLevel: ExperienceLevelSchema,
  goals: z.array(GoalDraftSchema),
  /** Tensions between goals, stated plainly ("Fat loss will slow deadlift progress."). */
  conflicts: z.array(z.string()),
  /** Programming rules derived from limitations ("No loaded overhead work: shoulder pain"). */
  constraints: z.array(z.string()),
  /** Anything the coach still needs to know, phrased as a direct question. */
  missingInformation: z.array(z.string()),
});
export type AthleteProfile = z.infer<typeof AthleteProfileSchema>;

import { z } from 'zod';
import { EquipmentSchema } from '../catalog/equipment.ts';

export const MovementPatternSchema = z.enum([
  'squat',
  'hinge',
  'lunge',
  'horizontal_push',
  'vertical_push',
  'horizontal_pull',
  'vertical_pull',
  'olympic',
  'core',
  'conditioning',
  'cardio',
  'mobility',
]);
export type MovementPattern = z.infer<typeof MovementPatternSchema>;

/** What a logged effort for this exercise records. Drives the log UI and which metrics it feeds. */
export const TrackingTypeSchema = z.enum([
  'weight_reps', // 275 lb x 3
  'reps', // 12 pull-ups
  'time', // 60 s plank
  'distance_time', // 5 km in 24:12
]);
export type TrackingType = z.infer<typeof TrackingTypeSchema>;

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  pattern: MovementPatternSchema,
  tracking: TrackingTypeSchema,
  /** All of these are required to perform the exercise. Empty = no equipment. */
  equipment: z.array(EquipmentSchema),
  muscles: z.array(z.string()),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

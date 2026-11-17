import { z } from 'zod';

/** The six ways progress can be measured. Every goal targets exactly one metric. */
export const MetricKindSchema = z.enum([
  'movement_performance', // deadlift e1RM, max pull-ups, 5K pace
  'benchmark_workout', // Murph, Fran, 2K row test
  'training_volume', // weekly running distance, weekly sets per muscle
  'body', // bodyweight, waist
  'skill', // first muscle-up
  'consistency', // sessions per week
]);
export type MetricKind = z.infer<typeof MetricKindSchema>;

export const MetricDirectionSchema = z.enum(['higher_is_better', 'lower_is_better']);
export type MetricDirection = z.infer<typeof MetricDirectionSchema>;

/** `derived` metrics are computed from the log; `manual` ones are entered by the user. */
export const MetricSourceSchema = z.enum(['derived', 'manual']);
export type MetricSource = z.infer<typeof MetricSourceSchema>;

export const MetricDefinitionSchema = z.object({
  key: z.string(), // e.g. "e1rm:deadlift", "bodyweight", "benchmark:murph"
  label: z.string(),
  kind: MetricKindSchema,
  unit: z.string(), // "kg", "s", "m", "sessions", "bool"
  direction: MetricDirectionSchema,
  source: MetricSourceSchema,
});
export type MetricDefinition = z.infer<typeof MetricDefinitionSchema>;

export const MetricEntrySchema = z.object({
  metricKey: z.string(),
  value: z.number(),
  recordedAt: z.iso.datetime({ offset: true }),
  source: MetricSourceSchema,
});
export type MetricEntry = z.infer<typeof MetricEntrySchema>;

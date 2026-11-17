import { z } from 'zod';

/** Calendar date in YYYY-MM-DD form. */
export const IsoDateSchema = z.iso.date();
export type IsoDate = z.infer<typeof IsoDateSchema>;

export const WeightUnitSchema = z.enum(['kg', 'lb']);
export type WeightUnit = z.infer<typeof WeightUnitSchema>;

export const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const DayOfWeekSchema = z.enum(DAYS_OF_WEEK);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

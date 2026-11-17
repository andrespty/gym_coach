import { z } from 'zod';
import { EquipmentSchema } from '../catalog/equipment.ts';
import { DayOfWeekSchema, IsoDateSchema, WeightUnitSchema } from './common.ts';

/*
 * The onboarding questionnaire. Every answer is a choice or a number, so the AI receives
 * clean, structured input. Weights are stored in kg and lengths in cm; the UI converts.
 */

export const SexSchema = z.enum(['male', 'female']);
export type Sex = z.infer<typeof SexSchema>;

export const TRAINING_AGE_LABELS = {
  none: 'Never trained consistently',
  lt_6m: 'Less than 6 months',
  '6_24m': '6 months to 2 years',
  '2_5y': '2 to 5 years',
  '5y_plus': 'More than 5 years',
} as const;
export const TrainingAgeSchema = z.enum(
  Object.keys(TRAINING_AGE_LABELS) as [keyof typeof TRAINING_AGE_LABELS],
);
export type TrainingAge = z.infer<typeof TrainingAgeSchema>;

export const CURRENT_FREQUENCY_LABELS = {
  '0': 'Not training right now',
  '1_2': '1–2 sessions a week',
  '3_4': '3–4 sessions a week',
  '5_plus': '5 or more a week',
} as const;
export const CurrentFrequencySchema = z.enum(
  Object.keys(CURRENT_FREQUENCY_LABELS) as [keyof typeof CURRENT_FREQUENCY_LABELS],
);
export type CurrentFrequency = z.infer<typeof CurrentFrequencySchema>;

export const DISCIPLINE_LABELS = {
  lifting: 'Strength training',
  running: 'Running',
  crossfit: 'CrossFit',
  bodybuilding: 'Bodybuilding',
  olympic_lifting: 'Olympic lifting',
  sports: 'Team sports',
  yoga_mobility: 'Yoga / mobility',
} as const;
export const DisciplineSchema = z.enum(
  Object.keys(DISCIPLINE_LABELS) as [keyof typeof DISCIPLINE_LABELS],
);
export type Discipline = z.infer<typeof DisciplineSchema>;

export const BODY_AREA_LABELS = {
  neck: 'Neck',
  shoulder: 'Shoulder',
  elbow: 'Elbow',
  wrist: 'Wrist',
  upper_back: 'Upper back',
  lower_back: 'Lower back',
  hip: 'Hip',
  knee: 'Knee',
  ankle: 'Ankle / foot',
} as const;
export const BodyAreaSchema = z.enum(
  Object.keys(BODY_AREA_LABELS) as [keyof typeof BODY_AREA_LABELS],
);
export type BodyArea = z.infer<typeof BodyAreaSchema>;

export const MUSCLE_FOCUS_LABELS = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  glutes: 'Glutes',
  core: 'Core',
} as const;
export const MuscleFocusSchema = z.enum(
  Object.keys(MUSCLE_FOCUS_LABELS) as [keyof typeof MUSCLE_FOCUS_LABELS],
);
export type MuscleFocus = z.infer<typeof MuscleFocusSchema>;

export const BENCHMARK_WORKOUTS = ['Fran', 'Grace', 'Helen', 'Murph'] as const;

export const CONDITIONING_SKILL_LABELS = {
  double_under: 'Double-unders',
  kipping_pull_up: 'Kipping pull-ups',
  toes_to_bar: 'Toes-to-bar',
  handstand_push_up: 'Handstand push-ups',
  muscle_up: 'Muscle-ups',
  rope_climb: 'Rope climbs',
} as const;
export type ConditioningSkill = keyof typeof CONDITIONING_SKILL_LABELS;

/** Lifts offered for strength goals. */
export const STRENGTH_GOAL_EXERCISE_IDS = [
  'back_squat',
  'front_squat',
  'deadlift',
  'bench_press',
  'overhead_press',
  'power_clean',
] as const;

export const SESSION_LENGTH_OPTIONS = [30, 45, 60, 75, 90] as const;

// ---------- Steps ----------

export const BasicsAnswersSchema = z.object({
  age: z.number().int().min(14).max(100),
  sex: SexSchema,
  heightCm: z.number().min(120).max(230),
  weightKg: z.number().min(30).max(300),
  preferredUnit: WeightUnitSchema,
});

export const BackgroundAnswersSchema = z.object({
  trainingAge: TrainingAgeSchema,
  currentFrequency: CurrentFrequencySchema,
  disciplines: z.array(DisciplineSchema),
});

const StrengthGoalAnswerSchema = z.object({
  type: z.literal('strength'),
  exerciseId: z.string(),
  recentBest: z
    .object({ weightKg: z.number().positive(), reps: z.number().int().min(1).max(20) })
    .nullable(),
  targetWeightKg: z.number().positive(),
  targetDate: IsoDateSchema.nullable(),
});

const RunningGoalAnswerSchema = z.object({
  type: z.literal('running'),
  weeklyDistanceKm: z.number().min(0),
  longestRecentRunKm: z.number().min(0),
  recentRace: z
    .object({ distanceKm: z.number().positive(), timeSeconds: z.number().int().positive() })
    .nullable(),
  targetEvent: z
    .object({
      distanceKm: z.number().positive(),
      targetTimeSeconds: z.number().int().positive().nullable(),
      date: IsoDateSchema.nullable(),
    })
    .nullable(),
});

const FatLossGoalAnswerSchema = z.object({
  type: z.literal('fat_loss'),
  targetBodyweightKg: z.number().positive().nullable(),
  targetWaistCm: z.number().positive().nullable(),
  targetDate: IsoDateSchema.nullable(),
});

const MuscleGoalAnswerSchema = z.object({
  type: z.literal('muscle'),
  focusAreas: z.array(MuscleFocusSchema),
});

const ConditioningGoalAnswerSchema = z.object({
  type: z.literal('conditioning'),
  knownBenchmarks: z.array(
    z.object({ name: z.string(), timeSeconds: z.number().int().positive() }),
  ),
  skills: z.array(z.string()),
});

const GeneralHealthGoalAnswerSchema = z.object({
  type: z.literal('general_health'),
});

export const GoalAnswerSchema = z.discriminatedUnion('type', [
  StrengthGoalAnswerSchema,
  RunningGoalAnswerSchema,
  FatLossGoalAnswerSchema,
  MuscleGoalAnswerSchema,
  ConditioningGoalAnswerSchema,
  GeneralHealthGoalAnswerSchema,
]);
export type GoalAnswer = z.infer<typeof GoalAnswerSchema>;

export const ScheduleAnswersSchema = z.object({
  daysPerWeek: z.number().int().min(1).max(7),
  preferredDays: z.array(DayOfWeekSchema),
  sessionMinutes: z.number().int().min(15).max(180),
});

export const EquipmentAnswersSchema = z.object({
  items: z.array(EquipmentSchema),
});

export const LimitationSchema = z.object({
  area: BodyAreaSchema,
  severity: z.enum(['mild', 'moderate', 'severe']),
  when: z.enum(['during', 'after', 'both']),
});
export type Limitation = z.infer<typeof LimitationSchema>;

export const LimitationsAnswersSchema = z.object({
  injuries: z.array(LimitationSchema),
  avoidExerciseIds: z.array(z.string()),
});

export const NOTES_MAX_LENGTH = 200;

/** The complete questionnaire. Goals are ordered by the user's ranking (index 0 = top priority). */
export const OnboardingAnswersSchema = z.object({
  basics: BasicsAnswersSchema,
  background: BackgroundAnswersSchema,
  goals: z.array(GoalAnswerSchema).min(1).max(3),
  schedule: ScheduleAnswersSchema,
  equipment: EquipmentAnswersSchema,
  limitations: LimitationsAnswersSchema,
  notes: z.string().max(NOTES_MAX_LENGTH),
});
export type OnboardingAnswers = z.infer<typeof OnboardingAnswersSchema>;

import type { Exercise } from '../schemas/exercise.ts';

/**
 * The exercise library. Source of truth for the `exercises` table:
 * run `pnpm --filter @gym-coach/core seed:exercises` to regenerate supabase/seed.sql.
 */
export const EXERCISES: readonly Exercise[] = [
  // Strength: lower body
  {
    id: 'back_squat',
    name: 'Back squat',
    pattern: 'squat',
    tracking: 'weight_reps',
    equipment: ['barbell', 'squat_rack'],
    muscles: ['quads', 'glutes'],
  },
  {
    id: 'front_squat',
    name: 'Front squat',
    pattern: 'squat',
    tracking: 'weight_reps',
    equipment: ['barbell', 'squat_rack'],
    muscles: ['quads', 'core'],
  },
  {
    id: 'goblet_squat',
    name: 'Goblet squat',
    pattern: 'squat',
    tracking: 'weight_reps',
    equipment: ['dumbbells'],
    muscles: ['quads', 'glutes'],
  },
  {
    id: 'leg_press',
    name: 'Leg press',
    pattern: 'squat',
    tracking: 'weight_reps',
    equipment: ['leg_press'],
    muscles: ['quads', 'glutes'],
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    pattern: 'hinge',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['hamstrings', 'glutes', 'back'],
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian deadlift',
    pattern: 'hinge',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['hamstrings', 'glutes'],
  },
  {
    id: 'db_romanian_deadlift',
    name: 'Dumbbell Romanian deadlift',
    pattern: 'hinge',
    tracking: 'weight_reps',
    equipment: ['dumbbells'],
    muscles: ['hamstrings', 'glutes'],
  },
  {
    id: 'kb_swing',
    name: 'Kettlebell swing',
    pattern: 'hinge',
    tracking: 'weight_reps',
    equipment: ['kettlebells'],
    muscles: ['glutes', 'hamstrings'],
  },
  {
    id: 'walking_lunge',
    name: 'Walking lunge',
    pattern: 'lunge',
    tracking: 'weight_reps',
    equipment: ['dumbbells'],
    muscles: ['quads', 'glutes'],
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian split squat',
    pattern: 'lunge',
    tracking: 'weight_reps',
    equipment: ['dumbbells', 'bench'],
    muscles: ['quads', 'glutes'],
  },

  // Strength: upper body
  {
    id: 'bench_press',
    name: 'Bench press',
    pattern: 'horizontal_push',
    tracking: 'weight_reps',
    equipment: ['barbell', 'bench', 'squat_rack'],
    muscles: ['chest', 'triceps'],
  },
  {
    id: 'db_bench_press',
    name: 'Dumbbell bench press',
    pattern: 'horizontal_push',
    tracking: 'weight_reps',
    equipment: ['dumbbells', 'bench'],
    muscles: ['chest', 'triceps'],
  },
  {
    id: 'push_up',
    name: 'Push-up',
    pattern: 'horizontal_push',
    tracking: 'reps',
    equipment: [],
    muscles: ['chest', 'triceps'],
  },
  {
    id: 'overhead_press',
    name: 'Overhead press',
    pattern: 'vertical_push',
    tracking: 'weight_reps',
    equipment: ['barbell', 'squat_rack'],
    muscles: ['shoulders', 'triceps'],
  },
  {
    id: 'db_shoulder_press',
    name: 'Dumbbell shoulder press',
    pattern: 'vertical_push',
    tracking: 'weight_reps',
    equipment: ['dumbbells'],
    muscles: ['shoulders', 'triceps'],
  },
  {
    id: 'barbell_row',
    name: 'Barbell row',
    pattern: 'horizontal_pull',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['back', 'biceps'],
  },
  {
    id: 'db_row',
    name: 'Dumbbell row',
    pattern: 'horizontal_pull',
    tracking: 'weight_reps',
    equipment: ['dumbbells', 'bench'],
    muscles: ['back', 'biceps'],
  },
  {
    id: 'cable_row',
    name: 'Seated cable row',
    pattern: 'horizontal_pull',
    tracking: 'weight_reps',
    equipment: ['cable_machine'],
    muscles: ['back', 'biceps'],
  },
  {
    id: 'pull_up',
    name: 'Pull-up',
    pattern: 'vertical_pull',
    tracking: 'reps',
    equipment: ['pull_up_bar'],
    muscles: ['back', 'biceps'],
  },
  {
    id: 'lat_pulldown',
    name: 'Lat pulldown',
    pattern: 'vertical_pull',
    tracking: 'weight_reps',
    equipment: ['cable_machine'],
    muscles: ['back', 'biceps'],
  },
  {
    id: 'band_pull_apart',
    name: 'Band pull-apart',
    pattern: 'horizontal_pull',
    tracking: 'reps',
    equipment: ['resistance_bands'],
    muscles: ['shoulders', 'back'],
  },

  // Olympic lifting
  {
    id: 'power_clean',
    name: 'Power clean',
    pattern: 'olympic',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['full_body'],
  },
  {
    id: 'snatch',
    name: 'Snatch',
    pattern: 'olympic',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['full_body'],
  },

  // Core
  {
    id: 'plank',
    name: 'Plank',
    pattern: 'core',
    tracking: 'time',
    equipment: [],
    muscles: ['core'],
  },
  {
    id: 'hanging_knee_raise',
    name: 'Hanging knee raise',
    pattern: 'core',
    tracking: 'reps',
    equipment: ['pull_up_bar'],
    muscles: ['core'],
  },

  // Conditioning
  {
    id: 'burpee',
    name: 'Burpee',
    pattern: 'conditioning',
    tracking: 'reps',
    equipment: [],
    muscles: ['full_body'],
  },
  {
    id: 'box_jump',
    name: 'Box jump',
    pattern: 'conditioning',
    tracking: 'reps',
    equipment: ['box'],
    muscles: ['quads', 'glutes'],
  },
  {
    id: 'double_under',
    name: 'Double-under',
    pattern: 'conditioning',
    tracking: 'reps',
    equipment: ['jump_rope'],
    muscles: ['calves'],
  },
  {
    id: 'wall_ball',
    name: 'Wall ball',
    pattern: 'conditioning',
    tracking: 'weight_reps',
    equipment: ['medicine_ball'],
    muscles: ['quads', 'shoulders'],
  },
  {
    id: 'thruster',
    name: 'Thruster',
    pattern: 'conditioning',
    tracking: 'weight_reps',
    equipment: ['barbell'],
    muscles: ['quads', 'shoulders'],
  },

  // Cardio
  {
    id: 'run',
    name: 'Run',
    pattern: 'cardio',
    tracking: 'distance_time',
    equipment: [],
    muscles: ['legs'],
  },
  {
    id: 'treadmill_run',
    name: 'Treadmill run',
    pattern: 'cardio',
    tracking: 'distance_time',
    equipment: ['treadmill'],
    muscles: ['legs'],
  },
  {
    id: 'row_erg',
    name: 'Row',
    pattern: 'cardio',
    tracking: 'distance_time',
    equipment: ['rower'],
    muscles: ['full_body'],
  },
  {
    id: 'bike_erg',
    name: 'Bike',
    pattern: 'cardio',
    tracking: 'distance_time',
    equipment: ['bike'],
    muscles: ['legs'],
  },
  {
    id: 'walk',
    name: 'Walk',
    pattern: 'cardio',
    tracking: 'distance_time',
    equipment: [],
    muscles: ['legs'],
  },

  // Mobility
  {
    id: 'mobility_flow',
    name: 'Mobility flow',
    pattern: 'mobility',
    tracking: 'time',
    equipment: [],
    muscles: ['full_body'],
  },
];

const EXERCISES_BY_ID = new Map(EXERCISES.map((exercise) => [exercise.id, exercise]));

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES_BY_ID.get(id);
}

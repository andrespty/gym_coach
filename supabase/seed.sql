-- GENERATED FILE. Do not edit by hand.
-- Source: packages/core/src/catalog/exercises.ts
-- Regenerate: pnpm --filter @gym-coach/core seed:exercises

insert into public.exercises (id, name, pattern, tracking, equipment, muscles)
values
  ('back_squat', 'Back squat', 'squat', 'weight_reps', array['barbell', 'squat_rack']::text[], array['quads', 'glutes']::text[]),
  ('front_squat', 'Front squat', 'squat', 'weight_reps', array['barbell', 'squat_rack']::text[], array['quads', 'core']::text[]),
  ('goblet_squat', 'Goblet squat', 'squat', 'weight_reps', array['dumbbells']::text[], array['quads', 'glutes']::text[]),
  ('leg_press', 'Leg press', 'squat', 'weight_reps', array['leg_press']::text[], array['quads', 'glutes']::text[]),
  ('deadlift', 'Deadlift', 'hinge', 'weight_reps', array['barbell']::text[], array['hamstrings', 'glutes', 'back']::text[]),
  ('romanian_deadlift', 'Romanian deadlift', 'hinge', 'weight_reps', array['barbell']::text[], array['hamstrings', 'glutes']::text[]),
  ('db_romanian_deadlift', 'Dumbbell Romanian deadlift', 'hinge', 'weight_reps', array['dumbbells']::text[], array['hamstrings', 'glutes']::text[]),
  ('kb_swing', 'Kettlebell swing', 'hinge', 'weight_reps', array['kettlebells']::text[], array['glutes', 'hamstrings']::text[]),
  ('walking_lunge', 'Walking lunge', 'lunge', 'weight_reps', array['dumbbells']::text[], array['quads', 'glutes']::text[]),
  ('bulgarian_split_squat', 'Bulgarian split squat', 'lunge', 'weight_reps', array['dumbbells', 'bench']::text[], array['quads', 'glutes']::text[]),
  ('bench_press', 'Bench press', 'horizontal_push', 'weight_reps', array['barbell', 'bench', 'squat_rack']::text[], array['chest', 'triceps']::text[]),
  ('db_bench_press', 'Dumbbell bench press', 'horizontal_push', 'weight_reps', array['dumbbells', 'bench']::text[], array['chest', 'triceps']::text[]),
  ('push_up', 'Push-up', 'horizontal_push', 'reps', '{}'::text[], array['chest', 'triceps']::text[]),
  ('overhead_press', 'Overhead press', 'vertical_push', 'weight_reps', array['barbell', 'squat_rack']::text[], array['shoulders', 'triceps']::text[]),
  ('db_shoulder_press', 'Dumbbell shoulder press', 'vertical_push', 'weight_reps', array['dumbbells']::text[], array['shoulders', 'triceps']::text[]),
  ('barbell_row', 'Barbell row', 'horizontal_pull', 'weight_reps', array['barbell']::text[], array['back', 'biceps']::text[]),
  ('db_row', 'Dumbbell row', 'horizontal_pull', 'weight_reps', array['dumbbells', 'bench']::text[], array['back', 'biceps']::text[]),
  ('cable_row', 'Seated cable row', 'horizontal_pull', 'weight_reps', array['cable_machine']::text[], array['back', 'biceps']::text[]),
  ('pull_up', 'Pull-up', 'vertical_pull', 'reps', array['pull_up_bar']::text[], array['back', 'biceps']::text[]),
  ('lat_pulldown', 'Lat pulldown', 'vertical_pull', 'weight_reps', array['cable_machine']::text[], array['back', 'biceps']::text[]),
  ('band_pull_apart', 'Band pull-apart', 'horizontal_pull', 'reps', array['resistance_bands']::text[], array['shoulders', 'back']::text[]),
  ('power_clean', 'Power clean', 'olympic', 'weight_reps', array['barbell']::text[], array['full_body']::text[]),
  ('snatch', 'Snatch', 'olympic', 'weight_reps', array['barbell']::text[], array['full_body']::text[]),
  ('plank', 'Plank', 'core', 'time', '{}'::text[], array['core']::text[]),
  ('hanging_knee_raise', 'Hanging knee raise', 'core', 'reps', array['pull_up_bar']::text[], array['core']::text[]),
  ('burpee', 'Burpee', 'conditioning', 'reps', '{}'::text[], array['full_body']::text[]),
  ('box_jump', 'Box jump', 'conditioning', 'reps', array['box']::text[], array['quads', 'glutes']::text[]),
  ('double_under', 'Double-under', 'conditioning', 'reps', array['jump_rope']::text[], array['calves']::text[]),
  ('wall_ball', 'Wall ball', 'conditioning', 'weight_reps', array['medicine_ball']::text[], array['quads', 'shoulders']::text[]),
  ('thruster', 'Thruster', 'conditioning', 'weight_reps', array['barbell']::text[], array['quads', 'shoulders']::text[]),
  ('run', 'Run', 'cardio', 'distance_time', '{}'::text[], array['legs']::text[]),
  ('treadmill_run', 'Treadmill run', 'cardio', 'distance_time', array['treadmill']::text[], array['legs']::text[]),
  ('row_erg', 'Row', 'cardio', 'distance_time', array['rower']::text[], array['full_body']::text[]),
  ('bike_erg', 'Bike', 'cardio', 'distance_time', array['bike']::text[], array['legs']::text[]),
  ('walk', 'Walk', 'cardio', 'distance_time', '{}'::text[], array['legs']::text[]),
  ('mobility_flow', 'Mobility flow', 'mobility', 'time', '{}'::text[], array['full_body']::text[])
on conflict (id) do update set
  name = excluded.name,
  pattern = excluded.pattern,
  tracking = excluded.tracking,
  equipment = excluded.equipment,
  muscles = excluded.muscles;

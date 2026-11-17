import { z } from 'zod';

/** Every piece of equipment the app knows about. Exercises and equipment profiles reference these ids. */
export const EQUIPMENT = [
  'barbell',
  'squat_rack',
  'bench',
  'dumbbells',
  'kettlebells',
  'pull_up_bar',
  'cable_machine',
  'leg_press',
  'rings',
  'jump_rope',
  'box',
  'rower',
  'bike',
  'treadmill',
  'resistance_bands',
  'medicine_ball',
] as const;

export const EquipmentSchema = z.enum(EQUIPMENT);
export type Equipment = z.infer<typeof EquipmentSchema>;

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Barbell + plates',
  squat_rack: 'Squat rack',
  bench: 'Bench',
  dumbbells: 'Dumbbells',
  kettlebells: 'Kettlebells',
  pull_up_bar: 'Pull-up bar',
  cable_machine: 'Cable machine',
  leg_press: 'Leg press',
  rings: 'Gymnastic rings',
  jump_rope: 'Jump rope',
  box: 'Plyo box',
  rower: 'Rower',
  bike: 'Bike / air bike',
  treadmill: 'Treadmill',
  resistance_bands: 'Resistance bands',
  medicine_ball: 'Medicine ball',
};

export const EQUIPMENT_PRESETS = {
  commercial_gym: [...EQUIPMENT],
  home_gym: [
    'barbell',
    'squat_rack',
    'bench',
    'dumbbells',
    'kettlebells',
    'pull_up_bar',
    'jump_rope',
    'resistance_bands',
  ],
  minimal: ['dumbbells', 'kettlebells', 'resistance_bands', 'jump_rope'],
  bodyweight: ['pull_up_bar'],
} as const satisfies Record<string, readonly Equipment[]>;

export type EquipmentPreset = keyof typeof EQUIPMENT_PRESETS;

export const EQUIPMENT_PRESET_LABELS: Record<EquipmentPreset, string> = {
  commercial_gym: 'Commercial gym',
  home_gym: 'Home gym',
  minimal: 'Minimal (a few weights)',
  bodyweight: 'Bodyweight only',
};

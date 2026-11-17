import type {
  ConditioningSkill,
  CurrentFrequency,
  DayOfWeek,
  Discipline,
  Equipment,
  EquipmentPreset,
  GoalType,
  Limitation,
  MuscleFocus,
  Sex,
  TrainingAge,
  WeightUnit,
} from '@gym-coach/core';

/*
 * The in-progress questionnaire. Values are kept in the units the user typed (lb/kg, in/cm,
 * mi/km) and are converted to kg/cm/km only when building the final answers.
 * `null` means "not answered yet"; an empty date string means "no date".
 */

export interface BasicsDraft {
  age: number | null;
  sex: Sex | null;
  height: number | null;
  weight: number | null;
  preferredUnit: WeightUnit;
}

export interface BackgroundDraft {
  trainingAge: TrainingAge | null;
  currentFrequency: CurrentFrequency | null;
  disciplines: Discipline[];
}

export interface StrengthGoalDraft {
  type: 'strength';
  exerciseId: string | null;
  bestWeight: number | null;
  bestReps: number | null;
  targetWeight: number | null;
  targetDate: string;
}

export interface RunningGoalDraft {
  type: 'running';
  weeklyDistance: number | null;
  longestRun: number | null;
  raceDistance: number | null;
  raceTimeSeconds: number | null;
  targetDistance: number | null;
  targetTimeSeconds: number | null;
  targetDate: string;
}

export interface FatLossGoalDraft {
  type: 'fat_loss';
  targetBodyweight: number | null;
  targetWaist: number | null;
  targetDate: string;
}

export interface MuscleGoalDraft {
  type: 'muscle';
  focusAreas: MuscleFocus[];
}

export interface ConditioningGoalDraft {
  type: 'conditioning';
  benchmarkSeconds: Record<string, number | null>;
  skills: ConditioningSkill[];
}

export interface GeneralHealthGoalDraft {
  type: 'general_health';
}

export type GoalDraftState =
  | StrengthGoalDraft
  | RunningGoalDraft
  | FatLossGoalDraft
  | MuscleGoalDraft
  | ConditioningGoalDraft
  | GeneralHealthGoalDraft;

export interface OnboardingDraft {
  basics: BasicsDraft;
  background: BackgroundDraft;
  /** Ordered by priority: index 0 is the top goal. */
  goals: GoalDraftState[];
  schedule: {
    daysPerWeek: number | null;
    preferredDays: DayOfWeek[];
    sessionMinutes: number | null;
  };
  equipment: { preset: EquipmentPreset | null; items: Equipment[] };
  limitations: { injuries: Limitation[]; avoidExerciseIds: string[] };
  notes: string;
}

export const INITIAL_DRAFT: OnboardingDraft = {
  basics: { age: null, sex: null, height: null, weight: null, preferredUnit: 'lb' },
  background: { trainingAge: null, currentFrequency: null, disciplines: [] },
  goals: [],
  schedule: { daysPerWeek: null, preferredDays: [], sessionMinutes: null },
  equipment: { preset: null, items: [] },
  limitations: { injuries: [], avoidExerciseIds: [] },
  notes: '',
};

export function emptyGoal(type: GoalType): GoalDraftState {
  switch (type) {
    case 'strength':
      return {
        type,
        exerciseId: null,
        bestWeight: null,
        bestReps: null,
        targetWeight: null,
        targetDate: '',
      };
    case 'running':
      return {
        type,
        weeklyDistance: null,
        longestRun: null,
        raceDistance: null,
        raceTimeSeconds: null,
        targetDistance: null,
        targetTimeSeconds: null,
        targetDate: '',
      };
    case 'fat_loss':
      return { type, targetBodyweight: null, targetWaist: null, targetDate: '' };
    case 'muscle':
      return { type, focusAreas: [] };
    case 'conditioning':
      return { type, benchmarkSeconds: {}, skills: [] };
    case 'general_health':
      return { type };
  }
}

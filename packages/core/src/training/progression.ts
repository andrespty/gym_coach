import type { ProgressionRule } from '../schemas/program.ts';
import { roundTo } from './units.ts';

/** Load change per point of RPE difference (target RPE − actual RPE). */
const LOAD_CHANGE_PER_RPE_POINT = 0.02;

export interface PerformedSet {
  reps: number;
  rpe: number | null;
}

export interface ProgressionInput {
  rule: ProgressionRule;
  lastLoad: number;
  lastSets: readonly PerformedSet[];
  repsMin: number;
  repsMax: number;
  targetRpe: number | null;
  /** Smallest load jump the user can make (e.g. 5 lb with 2.5 lb plates). */
  increment: number;
}

export interface LoadSuggestion {
  load: number;
  reason: string;
}

export function suggestNextLoad(input: ProgressionInput): LoadSuggestion {
  const { rule, lastLoad, lastSets, repsMin, repsMax, targetRpe, increment } = input;
  const hold = (reason: string): LoadSuggestion => ({ load: lastLoad, reason });
  const add = (reason: string): LoadSuggestion => ({ load: lastLoad + increment, reason });

  if (lastSets.length === 0) return hold('No previous sets: repeat the last load.');

  switch (rule) {
    case 'linear':
      return lastSets.every((set) => set.reps >= repsMin)
        ? add('All sets completed: add the standard increment.')
        : hold('Missed reps last time: repeat the load.');

    case 'double_progression':
      return lastSets.every((set) => set.reps >= repsMax)
        ? add(`Hit ${repsMax} reps on every set: add load and restart at ${repsMin}.`)
        : hold(`Keep the load until every set reaches ${repsMax} reps.`);

    case 'rpe_autoregulated': {
      const rpes = lastSets.map((set) => set.rpe).filter((rpe): rpe is number => rpe !== null);
      if (targetRpe === null || rpes.length === 0) return hold('No RPE logged: repeat the load.');
      const averageRpe = rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length;
      const change = (targetRpe - averageRpe) * LOAD_CHANGE_PER_RPE_POINT;
      const load = roundTo(lastLoad * (1 + change), increment);
      const direction = load > lastLoad ? 'up' : load < lastLoad ? 'down' : 'unchanged';
      return {
        load,
        reason: `Average RPE ${averageRpe.toFixed(1)} vs target ${targetRpe}: load ${direction}.`,
      };
    }

    case 'none':
      return hold('No automatic progression for this block.');
  }
}

import { findExercise, type Intensity, type PlannedBlock } from '@gym-coach/core';

const exerciseName = (id: string) => findExercise(id)?.name ?? id;

function describeIntensity(intensity: Intensity): string {
  switch (intensity.type) {
    case 'rpe':
      return `@ RPE ${intensity.rpe}`;
    case 'percent_e1rm':
      return `@ ${intensity.percent}%`;
    case 'bodyweight':
      return 'bodyweight';
  }
}

/** One-line title and detail for a planned block, e.g. "Deadlift" / "4 × 3–5 @ RPE 8". */
export function describeBlock(block: PlannedBlock): { title: string; detail: string } {
  switch (block.kind) {
    case 'sets': {
      const reps =
        block.repsMin === block.repsMax ? `${block.repsMin}` : `${block.repsMin}–${block.repsMax}`;
      return {
        title: exerciseName(block.exerciseId),
        detail: `${block.sets} × ${reps} ${describeIntensity(block.intensity)}`,
      };
    }
    case 'cardio': {
      const amount = block.intervals
        ? `${block.intervals.repeats} × ${block.intervals.workSeconds}s / ${block.intervals.restSeconds}s rest`
        : block.durationMinutes !== null
          ? `${block.durationMinutes} min`
          : `${block.distanceKm ?? '?'} km`;
      return {
        title: exerciseName(block.exerciseId),
        detail: `${amount} · ${block.effort.replace('_', ' ')}`,
      };
    }
    case 'timed': {
      const movements = block.movements
        .map((m) => `${m.reps ?? ''} ${exerciseName(m.exerciseId)}`.trim())
        .join(' · ');
      return {
        title: `${block.format.replace('_', ' ').toUpperCase()} ${block.timeCapMinutes} min`,
        detail: movements,
      };
    }
    case 'free':
      return {
        title: block.title,
        detail: `${block.durationMinutes} min${block.notes ? ` · ${block.notes}` : ''}`,
      };
  }
}

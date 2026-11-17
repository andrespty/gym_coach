import type { DayOfWeek } from '@gym-coach/core';
import { supabase } from '@/lib/supabase';
import type { WorkoutRecords } from '../model/workoutLog';

export interface SaveWorkoutRequest extends WorkoutRecords {
  programId: string;
  slotDay: DayOfWeek;
}

/** Saves a finished workout: the session, its sets, and any timed results. */
export async function saveWorkout(request: SaveWorkoutRequest): Promise<string> {
  const { data: session, error } = await supabase
    .from('workout_sessions')
    .insert({
      program_id: request.programId,
      slot_day: request.slotDay,
      planned_for: new Date().toLocaleDateString('en-CA'),
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  if (error) throw error;

  if (request.sets.length > 0) {
    const { error: setsError } = await supabase.from('set_logs').insert(
      request.sets.map((set) => ({
        session_id: session.id,
        exercise_id: set.exerciseId,
        block_index: set.blockIndex,
        set_index: set.setIndex,
        set_type: set.setType,
        weight_kg: set.weightKg,
        reps: set.reps,
        rpe: set.rpe,
        distance_m: set.distanceM,
        duration_s: set.durationS,
      })),
    );
    if (setsError) throw setsError;
  }

  if (request.timedResults.length > 0) {
    const { error: timedError } = await supabase.from('timed_results').insert(
      request.timedResults.map((result) => ({
        session_id: session.id,
        block_index: result.blockIndex,
        rounds: result.rounds,
        extra_reps: result.extraReps,
        time_seconds: result.timeSeconds,
      })),
    );
    if (timedError) throw timedError;
  }

  return session.id as string;
}

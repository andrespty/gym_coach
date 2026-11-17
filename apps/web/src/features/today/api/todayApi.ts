import { supabase } from '@/lib/supabase';

/** Dates (YYYY-MM-DD, local) with a completed session since `from`. */
export async function fetchCompletedDates(from: Date): Promise<string[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('completed_at')
    .eq('status', 'completed')
    .gte('completed_at', from.toISOString());
  if (error) throw error;

  return data.flatMap((row) =>
    row.completed_at ? [new Date(row.completed_at).toLocaleDateString('en-CA')] : [],
  );
}

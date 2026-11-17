import type { SupabaseClient } from '@supabase/supabase-js';
import type { StructuredResult } from './generateStructured.ts';

export interface GenerationRecord {
  kind: 'profile' | 'program' | 'proposal' | 'coach_reply';
  promptVersion: string;
  input: unknown;
  result: StructuredResult<unknown>;
}

/** Saves the model, prompt version and full input/output of a generation. Returns its id. */
export async function recordGeneration(
  supabase: SupabaseClient,
  userId: string,
  record: GenerationRecord,
): Promise<string> {
  const { data, error } = await supabase
    .from('ai_generations')
    .insert({
      user_id: userId,
      kind: record.kind,
      model: record.result.model,
      prompt_version: record.promptVersion,
      input: record.input,
      output: record.result.output,
      stop_reason: record.result.stopReason,
      input_tokens: record.result.inputTokens,
      output_tokens: record.result.outputTokens,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

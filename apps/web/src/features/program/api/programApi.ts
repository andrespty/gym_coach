import { ProgramDraftSchema, type ProgramDraft } from '@gym-coach/core';
import { supabase } from '@/lib/supabase';

export interface StoredProgram {
  id: string;
  status: 'draft' | 'active';
  plan: ProgramDraft;
  startedOn: string | null;
}

function toStoredProgram(row: {
  id: string;
  status: string;
  plan: unknown;
  started_on: string | null;
}): StoredProgram {
  return {
    id: row.id,
    status: row.status === 'active' ? 'active' : 'draft',
    plan: ProgramDraftSchema.parse(row.plan),
    startedOn: row.started_on,
  };
}

/** The active program, or failing that the newest draft. */
export async function fetchCurrentProgram(): Promise<StoredProgram | null> {
  const { data, error } = await supabase
    .from('programs')
    .select('id, status, plan, started_on')
    .in('status', ['active', 'draft'])
    .order('status', { ascending: true }) // 'active' sorts before 'draft'
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toStoredProgram(data) : null;
}

/** Makes a draft the active program, archiving any previous one. */
export async function activateProgram(programId: string): Promise<void> {
  const { error: archiveError } = await supabase
    .from('programs')
    .update({ status: 'archived' })
    .eq('status', 'active');
  if (archiveError) throw archiveError;

  const { error } = await supabase
    .from('programs')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
      started_on: new Date().toISOString().slice(0, 10),
    })
    .eq('id', programId);
  if (error) throw error;
}

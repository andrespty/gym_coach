import type {
  AthleteProfile,
  OnboardingAnswers,
  ProgramDraft,
  ProgramIssue,
} from '@gym-coach/core';
import { invokeFunction, supabase } from '@/lib/supabase';

export async function generateProfile(answers: OnboardingAnswers): Promise<AthleteProfile> {
  const result = await invokeFunction<{ profile: AthleteProfile }>('generate-profile', { answers });
  return result.profile;
}

/** Saves the profile the user confirmed and creates their goals. */
export async function confirmProfile(profile: AthleteProfile): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not signed in');

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ athlete_profile: profile, onboarded_at: new Date().toISOString() })
    .eq('id', auth.user.id);
  if (profileError) throw profileError;

  const { error: goalsError } = await supabase.from('goals').insert(
    profile.goals.map((goal) => ({
      type: goal.type,
      title: goal.title,
      metric_key: goal.metricKey,
      priority: goal.priority,
      baseline: goal.baseline,
      target: goal.target,
      target_date: goal.targetDate,
      assessment: goal.assessment,
    })),
  );
  if (goalsError) throw goalsError;
}

export interface GeneratedProgram {
  programId: string;
  plan: ProgramDraft;
  issues: ProgramIssue[];
}

export function generateProgram(): Promise<GeneratedProgram> {
  return invokeFunction<GeneratedProgram>('generate-program', {});
}

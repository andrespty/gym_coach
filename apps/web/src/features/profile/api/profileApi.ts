import {
  AthleteProfileSchema,
  WeightUnitSchema,
  type AthleteProfile,
  type WeightUnit,
} from '@gym-coach/core';
import { supabase } from '@/lib/supabase';

export interface Profile {
  preferredUnit: WeightUnit;
  athleteProfile: AthleteProfile | null;
  onboardedAt: string | null;
}

/** The signed-in user's profile, or null if they haven't started onboarding. */
export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('preferred_unit, athlete_profile, onboarded_at')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    preferredUnit: WeightUnitSchema.parse(data.preferred_unit),
    athleteProfile: data.athlete_profile ? AthleteProfileSchema.parse(data.athlete_profile) : null,
    onboardedAt: data.onboarded_at,
  };
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from './http.ts';

export interface AuthedContext {
  supabase: SupabaseClient;
  userId: string;
}

/**
 * Creates a Supabase client that acts as the calling user, so Row Level Security applies
 * to every query an Edge Function makes. Never use the service-role key here.
 */
export async function getAuthedContext(request: Request): Promise<AuthedContext> {
  const authorization = request.headers.get('Authorization');
  if (!authorization) throw new HttpError(401, 'Missing Authorization header');

  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new HttpError(401, 'Not signed in');

  return { supabase, userId: data.user.id };
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

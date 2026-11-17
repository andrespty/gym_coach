import { createClient } from '@supabase/supabase-js';
import { env } from './env';

/** The single Supabase client for the app. Row Level Security scopes every query to the signed-in user. */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

/** Calls an Edge Function and throws a readable error if it fails. */
export async function invokeFunction<Response>(
  name: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const { data, error } = await supabase.functions.invoke<Response>(name, { body });
  if (error) throw new Error(`${name} failed: ${error.message}`);
  if (data === null) throw new Error(`${name} returned no data`);
  return data;
}

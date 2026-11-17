function required(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value)
    throw new Error(`Missing ${name}. Copy apps/web/.env.example to apps/web/.env.local.`);
  return value;
}

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL'),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY'),
};

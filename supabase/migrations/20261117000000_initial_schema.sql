-- Initial schema for Gym Coach.
-- Every user-owned table has Row Level Security: a user can only see and change their own rows.
-- Weights are stored in kg, distances in metres, durations in seconds. The UI converts.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles: one row per user, created at onboarding
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  preferred_unit text not null default 'kg' check (preferred_unit in ('kg', 'lb')),
  onboarding_answers jsonb,          -- OnboardingAnswers (packages/core/src/schemas/onboarding.ts)
  athlete_profile jsonb,             -- AthleteProfile, confirmed by the user
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Exercise library (global, read-only for users; seeded from supabase/seed.sql)
-- ---------------------------------------------------------------------------

create table public.exercises (
  id text primary key,
  name text not null,
  pattern text not null,
  tracking text not null check (tracking in ('weight_reps', 'reps', 'time', 'distance_time')),
  equipment text[] not null default '{}',
  muscles text[] not null default '{}'
);

-- ---------------------------------------------------------------------------
-- Equipment profiles ("Home gym", "Commercial gym", "Hotel")
-- ---------------------------------------------------------------------------

create table public.equipment_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  items text[] not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index equipment_profiles_one_default
  on public.equipment_profiles (user_id) where is_default;

-- ---------------------------------------------------------------------------
-- AI generations: an audit trail of every model call (model + prompt version + I/O)
-- ---------------------------------------------------------------------------

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('profile', 'program', 'proposal', 'coach_reply')),
  model text not null,
  prompt_version text not null,
  input jsonb not null,
  output jsonb,
  stop_reason text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);

create index ai_generations_user_created on public.ai_generations (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Goals
-- ---------------------------------------------------------------------------

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('strength', 'running', 'fat_loss', 'muscle', 'conditioning', 'general_health')),
  title text not null,
  metric_key text not null,
  priority text not null check (priority in ('primary', 'secondary', 'maintain')),
  baseline numeric,
  target numeric,
  target_date date,
  assessment text,
  status text not null default 'active' check (status in ('active', 'achieved', 'abandoned')),
  created_at timestamptz not null default now()
);

create index goals_user_status on public.goals (user_id, status);

-- ---------------------------------------------------------------------------
-- Programs and proposed changes
-- ---------------------------------------------------------------------------

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  version integer not null default 1,
  plan jsonb not null,               -- ProgramDraft (packages/core/src/schemas/program.ts)
  ai_generation_id uuid references public.ai_generations (id) on delete set null,
  started_on date,
  created_at timestamptz not null default now(),
  activated_at timestamptz
);

create unique index programs_one_active_per_user
  on public.programs (user_id) where status = 'active';

create table public.program_change_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete cascade,
  summary text not null,
  rationale text not null,
  revised_plan jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  ai_generation_id uuid references public.ai_generations (id) on delete set null,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index program_change_proposals_pending
  on public.program_change_proposals (user_id) where status = 'pending';

-- ---------------------------------------------------------------------------
-- Training log
-- ---------------------------------------------------------------------------

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  program_id uuid references public.programs (id) on delete set null,
  slot_day text check (slot_day in ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
  planned_for date,
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed', 'skipped')),
  notes text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index workout_sessions_user_date on public.workout_sessions (user_id, started_at desc);

create table public.set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id text not null references public.exercises (id),
  block_index integer not null,
  set_index integer not null,
  set_type text not null check (set_type in ('warmup', 'working', 'amrap', 'drop')),
  weight_kg numeric check (weight_kg >= 0),
  reps integer check (reps >= 0),
  rpe numeric check (rpe between 1 and 10),
  distance_m numeric check (distance_m >= 0),
  duration_s numeric check (duration_s >= 0),
  created_at timestamptz not null default now()
);

create index set_logs_user_exercise on public.set_logs (user_id, exercise_id, created_at desc);
create index set_logs_session on public.set_logs (session_id);

create table public.timed_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  block_index integer not null,
  rounds integer,
  extra_reps integer,
  time_seconds integer,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Metrics: manual entries (bodyweight, waist) and derived snapshots (e1RM)
-- ---------------------------------------------------------------------------

create table public.metric_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  metric_key text not null,
  value numeric not null,
  source text not null check (source in ('derived', 'manual')),
  session_id uuid references public.workout_sessions (id) on delete set null,
  recorded_at timestamptz not null default now()
);

create index metric_entries_user_metric on public.metric_entries (user_id, metric_key, recorded_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.equipment_profiles enable row level security;
alter table public.ai_generations enable row level security;
alter table public.goals enable row level security;
alter table public.programs enable row level security;
alter table public.program_change_proposals enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.set_logs enable row level security;
alter table public.timed_results enable row level security;
alter table public.metric_entries enable row level security;

create policy "Users manage their own profile" on public.profiles
  for all to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Exercises are readable by signed-in users" on public.exercises
  for select to authenticated
  using (true);

-- AI generations are written by Edge Functions on the user's behalf and are append-only.
create policy "Users read their own AI generations" on public.ai_generations
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users insert their own AI generations" on public.ai_generations
  for insert to authenticated
  with check (user_id = (select auth.uid()));

do $$
declare
  owned_table text;
begin
  foreach owned_table in array array[
    'equipment_profiles',
    'goals',
    'programs',
    'program_change_proposals',
    'workout_sessions',
    'set_logs',
    'timed_results',
    'metric_entries'
  ]
  loop
    execute format(
      'create policy "Users manage their own rows" on public.%I
         for all to authenticated
         using (user_id = (select auth.uid()))
         with check (user_id = (select auth.uid()))',
      owned_table
    );
  end loop;
end;
$$;

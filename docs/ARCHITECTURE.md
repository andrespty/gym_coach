# Architecture

## Repository layout

```
gym_coach/
├─ apps/web/                 React app (Vite + TypeScript + Tailwind)
│  └─ src/
│     ├─ app/                Router, providers, guards, layout shell
│     ├─ features/           One folder per feature (see "Feature folders")
│     ├─ components/ui/      Shared building blocks: Button, Card, NumberField, …
│     ├─ lib/                Supabase client, formatting, units, dates
│     └─ styles/             Tailwind entry + design tokens
├─ packages/core/            Pure TypeScript: schemas + training logic. No React, no Supabase.
│  └─ src/
│     ├─ catalog/            Exercise library and equipment
│     ├─ schemas/            Zod schemas: onboarding, profile, program, session, metric, goal
│     ├─ training/           e1RM, plates, PR detection, feasibility, progression, limitations
│     └─ validation/         validateProgram: hard rules for AI-drafted programs
├─ supabase/
│  ├─ migrations/            Ordered SQL. The only way the schema changes.
│  ├─ seed.sql               GENERATED from packages/core/src/catalog/exercises.ts
│  └─ functions/             Edge Functions (Deno). The only place AI is called.
│     ├─ _shared/ai/         config.ts (models), generateStructured.ts, recordGeneration.ts
│     ├─ _shared/prompts/    Versioned prompts: profile.v1.ts, program.v1.ts, coachPrinciples.ts
│     ├─ _shared/context/    Builds the data each prompt receives
│     ├─ generate-profile/
│     └─ generate-program/
├─ evals/                    Test personas + deterministic checks
└─ docs/                     PLAN.md, ARCHITECTURE.md
```

## Rules

1. **One component per file**, named after the component (`SetRow.tsx` exports `SetRow`).
2. **Features are isolated.** Other code imports a feature only through its `index.ts`. ESLint enforces this (`@/features/x/internal` is an error).
3. **Components don't fetch.** Data access lives in a feature's `api/` (plain async functions) and `hooks/` (TanStack Query). Components render.
4. **Pure logic lives in `model/` or `packages/core`** and has tests next to it (`buildWeek.ts` ↔ `buildWeek.test.ts`).
5. **`packages/core` is shared** by the web app and the Edge Functions, so formulas and schemas exist exactly once. Its imports use explicit `.ts` extensions so Deno can load it.
6. **AI runs only in Edge Functions.** The browser never sees the Anthropic key.
7. **Edge Functions act as the user.** They use the caller's JWT, so Row Level Security applies to every query. No service-role key.

### Feature folders

```
features/<name>/
├─ api/          Supabase / Edge Function calls
├─ hooks/        React Query + local state
├─ model/        Pure functions and types (tested)
├─ components/   One component per file
└─ index.ts      The feature's public surface
```

## Data model

All user tables have RLS (`user_id = auth.uid()`). Units are canonical: kg, cm, metres, seconds.

| Table                      | Purpose                                                                           |
| -------------------------- | --------------------------------------------------------------------------------- |
| `profiles`                 | Questionnaire answers, confirmed athlete profile, unit preference                 |
| `exercises`                | Global exercise library (read-only), generated seed                               |
| `equipment_profiles`       | Named equipment sets (home, gym, hotel)                                           |
| `goals`                    | One row per goal: metric key, priority, baseline, target, date                    |
| `programs`                 | `plan` JSON (ProgramDraft); status draft → active → archived; one active per user |
| `program_change_proposals` | Coach proposals awaiting Accept / Decline                                         |
| `workout_sessions`         | A performed (or skipped) session                                                  |
| `set_logs`                 | Every logged effort: weight × reps, or distance / duration                        |
| `timed_results`            | AMRAP rounds, for-time results                                                    |
| `metric_entries`           | Manual metrics and derived snapshots                                              |
| `ai_generations`           | Audit trail: model, prompt version, input, output, tokens                         |

## AI pipeline

```
questionnaire ─► generate-profile ─► user confirms ─► generate-program ─► validateProgram
                                                            ▲                 │ issues?
                                                            └──── one retry ◄─┘
                                                                              ▼
                                                                    draft saved ─► user accepts
```

- **Structured outputs**: `client.messages.parse` + `zodOutputFormat(schema)` guarantees the response matches the shared Zod schema.
- **Models and effort** are configured in `supabase/functions/_shared/ai/config.ts`.
- **Prompts are versioned files.** Change a prompt by adding `*.v2.ts`; every generation stores the `prompt_version` it used.
- **The coach quotes numbers instead of inventing them**: feasibility is computed in code and passed in as context.
- **Refusals and truncation** (`stop_reason` of `refusal` or `max_tokens`) become clear HTTP errors. A server-side refusal fallback is not wired up yet; add it if refusals show up in practice.

## Changing things safely

| Change           | How                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Database schema  | Add a new file in `supabase/migrations/` (`supabase migration new <name>`). Never edit an applied migration. |
| Exercise library | Edit `packages/core/src/catalog/exercises.ts`, then `pnpm --filter @gym-coach/core seed:exercises`.          |
| A prompt         | Copy to the next version (`program.v2.ts`), switch the import, run the evals.                                |
| A model          | Edit `_shared/ai/config.ts`, run the evals.                                                                  |
| Shared types     | Edit the Zod schema in `packages/core/src/schemas/`; TypeScript shows every place that must follow.          |

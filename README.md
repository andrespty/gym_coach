# Gym Coach

An AI gym coach for any kind of training (strength, running, bodybuilding, CrossFit-style conditioning) that builds your program, logs your workouts, and tells you the truth about your goals.

- **Plan:** [docs/PLAN.md](docs/PLAN.md)
- **Architecture and conventions:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Requirements

- Node 20+ and pnpm 10 (`corepack enable`)
- [Supabase CLI](https://supabase.com/docs/guides/cli) and Docker, for the local database and Edge Functions
- An Anthropic API key

## Getting started

```bash
pnpm install
```

Start Supabase locally. This applies the migrations and the exercise seed:

```bash
supabase start
```

Configure the web app with the API URL and anon key that `supabase start` prints:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Give the Edge Functions your Anthropic key:

```bash
cp supabase/functions/.env.example supabase/functions/.env
```

Serve the Edge Functions:

```bash
supabase functions serve --env-file supabase/functions/.env
```

In another terminal, run the app:

```bash
pnpm dev
```

Sign in with any email address. Locally, sign-in emails go to the Supabase mail viewer at http://127.0.0.1:54324.

## Scripts

| Command                                        | What it does                                             |
| ---------------------------------------------- | -------------------------------------------------------- |
| `pnpm dev`                                     | Run the web app                                          |
| `pnpm build`                                   | Typecheck and build everything                           |
| `pnpm typecheck`                               | TypeScript across all packages                           |
| `pnpm test`                                    | Unit tests (core, web models, evals)                     |
| `pnpm lint`                                    | ESLint                                                   |
| `pnpm format`                                  | Prettier                                                 |
| `pnpm --filter @gym-coach/core seed:exercises` | Regenerate `supabase/seed.sql` from the exercise catalog |

## Deploying

```bash
supabase link --project-ref <your-project-ref>
```

```bash
supabase db push
```

```bash
supabase secrets set ANTHROPIC_API_KEY=<your-key>
```

```bash
supabase functions deploy generate-profile
```

```bash
supabase functions deploy generate-program
```

Then build `apps/web` (`pnpm build`) and host `apps/web/dist` on any static host, with the production Supabase URL and anon key in its environment.

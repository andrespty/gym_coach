# Gym Coach

An AI gym coach for any kind of training (strength, running, bodybuilding, CrossFit-style conditioning) that builds your program, logs your workouts, and tells you the truth about your goals.

- **Plan:** [docs/PLAN.md](docs/PLAN.md)
- **Architecture and conventions:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Requirements

- Node 20+ and pnpm 10 (`npm install -g pnpm@10`)
- Docker Desktop (or OrbStack), running, for the local database and Edge Functions
- An Anthropic API key

The Supabase CLI is a pinned dev dependency, so `pnpm install` installs it. Run it as `pnpm supabase <command>`.

## Getting started

```bash
pnpm install
```

Start Supabase locally. This applies the migrations and the exercise seed:

```bash
pnpm db:start
```

Configure the web app with the API URL and anon key that `pnpm db:start` prints:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Give the Edge Functions your Anthropic key:

```bash
cp supabase/functions/.env.example supabase/functions/.env
```

Serve the Edge Functions:

```bash
pnpm functions:serve
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
| `pnpm db:start` / `pnpm db:stop`               | Start / stop local Supabase (needs Docker running)       |
| `pnpm functions:serve`                         | Serve the Edge Functions locally                         |
| `pnpm supabase <command>`                      | Any other Supabase CLI command                           |
| `pnpm build`                                   | Typecheck and build everything                           |
| `pnpm typecheck`                               | TypeScript across all packages                           |
| `pnpm test`                                    | Unit tests (core, web models, evals)                     |
| `pnpm lint`                                    | ESLint                                                   |
| `pnpm format`                                  | Prettier                                                 |
| `pnpm --filter @gym-coach/core seed:exercises` | Regenerate `supabase/seed.sql` from the exercise catalog |

## Deploying

```bash
pnpm supabase link --project-ref <your-project-ref>
```

```bash
pnpm supabase db push
```

```bash
pnpm supabase secrets set ANTHROPIC_API_KEY=<your-key>
```

```bash
pnpm supabase functions deploy generate-profile
```

```bash
pnpm supabase functions deploy generate-program
```

Then build `apps/web` (`pnpm build`) and host `apps/web/dist` on any static host, with the production Supabase URL and anon key in its environment.

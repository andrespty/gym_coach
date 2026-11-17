# Gym Coach: Product Plan

An AI gym coach for any kind of training: strength, running, bodybuilding, CrossFit-style conditioning, or a mix. Built for one user (the author) first.

## Decisions so far

| Topic           | Decision                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------ |
| Audience        | Just me for now                                                                            |
| Stack           | React + Vite + TypeScript, Tailwind, Supabase (Postgres, Auth, Edge Functions), Claude API |
| Training styles | Any. Sessions are made of blocks; progress is tracked as metrics                           |
| Goals           | Several at once, each with a priority (primary / secondary / maintain)                     |
| Nutrition       | Not tracked. Fat-loss goals track bodyweight and waist only                                |
| Program changes | The coach always **proposes**; nothing changes without approval                            |
| Coach tone      | Honest, not agreeable. Uses computed numbers, names trade-offs, no flattery                |
| Onboarding      | A specific questionnaire (taps and numbers), not free text                                 |
| Design          | Dark "Graphite + Lime"; Outfit for text, JetBrains Mono for numbers                        |
| Source of truth | Schema migrations, prompts and model IDs all live in the repo                              |

## Core concepts

### Everything is a metric

Progress can be measured six ways, and every goal targets one metric:

| Kind                 | Examples                                | Source                |
| -------------------- | --------------------------------------- | --------------------- |
| Movement performance | Deadlift e1RM, max pull-ups, 5K pace    | Derived from the log  |
| Benchmark workouts   | Murph, Fran, 2K row                     | Derived from the log  |
| Training volume      | Weekly distance, weekly sets per muscle | Derived from the log  |
| Body                 | Bodyweight, waist                       | Entered by hand       |
| Skills               | First muscle-up                         | Ticked off in the log |
| Consistency          | Sessions per week, adherence            | Derived from the log  |

### Programs prescribe targets, not just exercises

A weekly slot says what the day is _for_ ("heavy hinge, 3–5 reps at RPE 8"). That lets "adjust today" swap exercises and still serve the plan.

### Session blocks

`sets` (strength and hypertrophy), `cardio` (steady or intervals), `timed` (AMRAP / EMOM / for time), `free` (warm-up, mobility).

### Who decides what

| AI decides                    | Code decides                                  |
| ----------------------------- | --------------------------------------------- |
| Split, exercise choice, swaps | Loads from %e1RM, rounding to real plates     |
| Balancing several goals       | Progression rules                             |
| Adapting to feedback          | e1RM, PR detection, trends                    |
| Explaining, coaching tone     | Feasibility math                              |
|                               | Validation: equipment, injuries, time, volume |

## How the features connect

```
Log ──► Metrics ──► Progress
               └──► Coach ──► Program ──► Today's workout ──► Log
```

- **Onboarding**: questionnaire → AI drafts an athlete profile → user confirms → AI drafts a program → code validates (one retry with the errors) → user accepts.
- **Today**: the active program's slot for today, the week strip, and a Start button.
- **Log**: inputs that match each block type; finishing saves the session, its sets, and timed results.
- **Program**: phases, weekly slots, coach notes; a draft must be accepted before it becomes active.
- **Progress**: one view per goal (main metric, trend, projected date), consistency and PRs.
- **Coach**: chat with read-only access to your data, weekly check-ins, and change proposals (Accept / Decline / Tweak).

## Roadmap

### Phase 1: Foundation (this commit)

- [x] Monorepo, tooling, design tokens
- [x] Shared schemas and training math (`packages/core`) with tests
- [x] Database schema with Row Level Security, exercise seed
- [x] Edge Functions: `generate-profile`, `generate-program` (structured outputs, validation, retry, audit trail)
- [x] Web: sign-in, onboarding questionnaire, profile review, program review/accept, Today, Log
- [x] Evals: four personas with deterministic checks

### Phase 2: Progress and PRs

- [ ] PR detection after each workout, shown on the finish screen
- [ ] Derived metric snapshots (e1RM per lift, weekly distance, sessions per week)
- [ ] Progress screen: goal charts, consistency heatmap, PR list
- [ ] Manual body metrics (bodyweight, waist)
- [ ] Load suggestions from progression rules shown while logging
- [ ] Plate calculator and warm-up set generator in the log

### Phase 3: Coach

- [ ] `coach-chat` Edge Function with read-only tools plus `propose_program_change`
- [ ] `weekly-review` Edge Function (scheduled) that writes a check-in and optional proposal
- [ ] Proposal cards: Accept / Decline / Tweak, with history and undo
- [ ] "Not feeling it? Adjust today": readiness check-in → replacement session that serves the same slot

### Phase 4: Polish

- [ ] Multiple equipment profiles (home / gym / hotel)
- [ ] Offline logging with sync
- [ ] Route-level code splitting (bundle is ~740 kB today)
- [ ] LLM-graded evals for the `coachMustDo` expectations

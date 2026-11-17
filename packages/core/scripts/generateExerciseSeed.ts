/**
 * Regenerates supabase/seed.sql from the exercise catalog in src/catalog/exercises.ts,
 * so the database and the code always agree on which exercises exist.
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXERCISES } from '../src/catalog/exercises.ts';

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../../supabase/seed.sql');

const quote = (value: string): string => `'${value.replaceAll("'", "''")}'`;
const textArray = (values: readonly string[]): string =>
  values.length === 0 ? `'{}'::text[]` : `array[${values.map(quote).join(', ')}]::text[]`;

const rows = EXERCISES.map(
  (exercise) =>
    `  (${quote(exercise.id)}, ${quote(exercise.name)}, ${quote(exercise.pattern)}, ` +
    `${quote(exercise.tracking)}, ${textArray(exercise.equipment)}, ${textArray(exercise.muscles)})`,
);

const sql = `-- GENERATED FILE. Do not edit by hand.
-- Source: packages/core/src/catalog/exercises.ts
-- Regenerate: pnpm --filter @gym-coach/core seed:exercises

insert into public.exercises (id, name, pattern, tracking, equipment, muscles)
values
${rows.join(',\n')}
on conflict (id) do update set
  name = excluded.name,
  pattern = excluded.pattern,
  tracking = excluded.tracking,
  equipment = excluded.equipment,
  muscles = excluded.muscles;
`;

writeFileSync(outputPath, sql);
console.log(`Wrote ${EXERCISES.length} exercises to ${outputPath}`);

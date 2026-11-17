/**
 * POST {} → { programId, plan: ProgramDraft, issues: ProgramIssue[] }
 *
 * Drafts a program from the user's confirmed profile, validates it against hard rules,
 * and gives the model one chance to fix any violations. The result is saved as a *draft*:
 * it only becomes active when the user accepts it in the app.
 */
import {
  AthleteProfileSchema,
  OnboardingAnswersSchema,
  ProgramDraftSchema,
  validateProgram,
  type ProgramDraft,
} from '@gym-coach/core';
import type Anthropic from '@anthropic-ai/sdk';
import { generateStructured, type StructuredResult } from '../_shared/ai/generateStructured.ts';
import { recordGeneration } from '../_shared/ai/recordGeneration.ts';
import {
  buildProgramUserMessage,
  buildRetryMessage,
  buildValidationContext,
} from '../_shared/context/buildProgramContext.ts';
import { HttpError, jsonResponse, serveJson } from '../_shared/http.ts';
import { PROGRAM_PROMPT_VERSION, PROGRAM_SYSTEM_PROMPT } from '../_shared/prompts/program.v1.ts';
import { getAuthedContext } from '../_shared/supabaseClient.ts';

const MAX_ATTEMPTS = 2;

serveJson(async (request) => {
  const { supabase, userId } = await getAuthedContext(request);

  const { data: row, error: loadError } = await supabase
    .from('profiles')
    .select('onboarding_answers, athlete_profile')
    .eq('id', userId)
    .maybeSingle();
  if (loadError) throw loadError;

  const answers = OnboardingAnswersSchema.safeParse(row?.onboarding_answers);
  const profile = AthleteProfileSchema.safeParse(row?.athlete_profile);
  if (!answers.success || !profile.success) {
    throw new HttpError(409, 'Finish onboarding and confirm your profile first.');
  }

  const rules = buildValidationContext(answers.data);
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: buildProgramUserMessage(answers.data, profile.data, rules) },
  ];

  let result: StructuredResult<ProgramDraft> | null = null;
  let issues = [] as ReturnType<typeof validateProgram>;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    result = await generateStructured({
      task: 'program',
      system: PROGRAM_SYSTEM_PROMPT,
      messages,
      schema: ProgramDraftSchema,
    });
    issues = validateProgram(result.output, rules);
    if (issues.length === 0) break;

    messages.push(
      { role: 'assistant', content: JSON.stringify(result.output) },
      { role: 'user', content: buildRetryMessage(issues) },
    );
  }

  if (!result) throw new Error('No program generated');

  const generationId = await recordGeneration(supabase, userId, {
    kind: 'program',
    promptVersion: PROGRAM_PROMPT_VERSION,
    input: { messages, remainingIssues: issues },
    result,
  });

  // Only one draft at a time: older drafts are archived.
  await supabase
    .from('programs')
    .update({ status: 'archived' })
    .eq('user_id', userId)
    .eq('status', 'draft');

  const { data: program, error: insertError } = await supabase
    .from('programs')
    .insert({
      user_id: userId,
      status: 'draft',
      plan: result.output,
      ai_generation_id: generationId,
    })
    .select('id')
    .single();
  if (insertError) throw insertError;

  return jsonResponse({ programId: program.id, plan: result.output, issues });
});

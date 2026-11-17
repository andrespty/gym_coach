/**
 * POST { answers: OnboardingAnswers } → { generationId, profile: AthleteProfile }
 *
 * Saves the questionnaire answers and asks the coach to draft an athlete profile.
 * The profile is NOT saved as confirmed here: the user reviews it first in the app.
 */
import { AthleteProfileSchema, OnboardingAnswersSchema } from '@gym-coach/core';
import { generateStructured } from '../_shared/ai/generateStructured.ts';
import { recordGeneration } from '../_shared/ai/recordGeneration.ts';
import { buildProfileUserMessage } from '../_shared/context/buildProfileContext.ts';
import { HttpError, jsonResponse, serveJson } from '../_shared/http.ts';
import { PROFILE_PROMPT_VERSION, PROFILE_SYSTEM_PROMPT } from '../_shared/prompts/profile.v1.ts';
import { getAuthedContext } from '../_shared/supabaseClient.ts';

serveJson(async (request) => {
  const { supabase, userId } = await getAuthedContext(request);

  const body = await request.json().catch(() => null);
  const parsed = OnboardingAnswersSchema.safeParse(body?.answers);
  if (!parsed.success) throw new HttpError(400, 'Invalid onboarding answers', parsed.error.issues);
  const answers = parsed.data;

  const { error: saveError } = await supabase.from('profiles').upsert({
    id: userId,
    preferred_unit: answers.basics.preferredUnit,
    onboarding_answers: answers,
  });
  if (saveError) throw saveError;

  const userMessage = buildProfileUserMessage(answers);
  const result = await generateStructured({
    task: 'profile',
    system: PROFILE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    schema: AthleteProfileSchema,
  });

  const generationId = await recordGeneration(supabase, userId, {
    kind: 'profile',
    promptVersion: PROFILE_PROMPT_VERSION,
    input: { userMessage },
    result,
  });

  return jsonResponse({ generationId, profile: result.output });
});

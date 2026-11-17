import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import type { z } from 'zod';
import { HttpError } from '../http.ts';
import { requireEnv } from '../supabaseClient.ts';
import { AI_TASKS, type AiTask } from './config.ts';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') });
  return client;
}

export interface StructuredRequest<Schema extends z.ZodType> {
  task: AiTask;
  system: string;
  messages: Anthropic.MessageParam[];
  schema: Schema;
}

export interface StructuredResult<Output> {
  output: Output;
  model: string;
  stopReason: string | null;
  inputTokens: number;
  outputTokens: number;
}

/**
 * One model call whose answer is guaranteed to match `schema` (structured outputs),
 * validated again by zod on the way back.
 */
export async function generateStructured<Schema extends z.ZodType>(
  request: StructuredRequest<Schema>,
): Promise<StructuredResult<z.infer<Schema>>> {
  const config = AI_TASKS[request.task];

  const response = await getClient().messages.parse({
    model: config.model,
    max_tokens: config.maxTokens,
    system: request.system,
    messages: request.messages,
    output_config: { effort: config.effort, format: zodOutputFormat(request.schema) },
  });

  if (response.stop_reason === 'refusal') {
    throw new HttpError(422, 'The coach declined this request.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new HttpError(502, 'The response was cut off before it finished. Try again.');
  }
  if (response.parsed_output === null) {
    throw new HttpError(502, 'The response did not match the expected format.');
  }

  return {
    output: response.parsed_output,
    model: response.model,
    stopReason: response.stop_reason,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

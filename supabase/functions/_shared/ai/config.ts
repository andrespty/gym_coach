/**
 * Every AI task in one place: which model, how hard it thinks, and its output budget.
 * Changing a model here is a tracked, reviewable change; each generation also records the
 * model it used in the `ai_generations` table.
 */
export type AiTask = 'profile' | 'program';

export interface AiTaskConfig {
  model: string;
  effort: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  maxTokens: number;
}

export const AI_TASKS: Record<AiTask, AiTaskConfig> = {
  profile: { model: 'claude-opus-5-5', effort: 'medium', maxTokens: 8000 },
  program: { model: 'claude-opus-5-5', effort: 'high', maxTokens: 16000 },
};

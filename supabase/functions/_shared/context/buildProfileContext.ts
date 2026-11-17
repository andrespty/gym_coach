import {
  assessFeasibility,
  bestE1rm,
  findExercise,
  typicalWeeklyRate,
  type ExperienceLevel,
  type OnboardingAnswers,
} from '@gym-coach/core';

const DAYS_PER_WEEK = 7;
const MS_PER_WEEK = DAYS_PER_WEEK * 24 * 60 * 60 * 1000;

/** Rough experience level from the questionnaire, used only for the feasibility heuristics. */
function estimateLevel(answers: OnboardingAnswers): ExperienceLevel {
  switch (answers.background.trainingAge) {
    case 'none':
    case 'lt_6m':
      return 'beginner';
    case '6_24m':
    case '2_5y':
      return 'intermediate';
    case '5y_plus':
      return 'advanced';
  }
}

function weeksUntil(isoDate: string, today: Date): number {
  return Math.max(0, (new Date(isoDate).getTime() - today.getTime()) / MS_PER_WEEK);
}

/** Feasibility numbers the coach must quote instead of estimating on its own. */
function computeStrengthFeasibility(answers: OnboardingAnswers, today: Date) {
  const level = estimateLevel(answers);
  const rate = typicalWeeklyRate('strength', level);

  return answers.goals.flatMap((goal) => {
    if (goal.type !== 'strength' || !goal.recentBest || !goal.targetDate || rate === null)
      return [];
    const current = bestE1rm([{ weight: goal.recentBest.weightKg, reps: goal.recentBest.reps }]);
    if (current === null) return [];

    const result = assessFeasibility({
      current,
      target: goal.targetWeightKg,
      weeksAvailable: weeksUntil(goal.targetDate, today),
      direction: 'higher_is_better',
      typicalWeeklyRate: rate,
    });

    return [
      {
        exercise: findExercise(goal.exerciseId)?.name ?? goal.exerciseId,
        currentE1rmKg: Math.round(current * 10) / 10,
        targetKg: goal.targetWeightKg,
        targetDate: goal.targetDate,
        verdict: result.verdict,
        weeksNeededAtTypicalRate: result.weeksAtTypicalRate,
        realisticTargetByDateKg: Math.round(result.realisticTarget * 10) / 10,
      },
    ];
  });
}

export function buildProfileUserMessage(answers: OnboardingAnswers, today = new Date()): string {
  const context = {
    today: today.toISOString().slice(0, 10),
    onboardingAnswers: answers,
    computedFeasibility: computeStrengthFeasibility(answers, today),
  };
  return `Here are the athlete's answers and the numbers computed from them.\n\n${JSON.stringify(context, null, 2)}`;
}

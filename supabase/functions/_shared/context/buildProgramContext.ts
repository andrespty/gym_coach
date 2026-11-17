import {
  blockedPatternsFor,
  EXERCISES,
  type AthleteProfile,
  type OnboardingAnswers,
  type ProgramIssue,
  type ProgramValidationContext,
} from '@gym-coach/core';

/** The hard rules a drafted program is validated against. */
export function buildValidationContext(answers: OnboardingAnswers): ProgramValidationContext {
  return {
    daysPerWeek: answers.schedule.daysPerWeek,
    sessionMinutes: answers.schedule.sessionMinutes,
    availableEquipment: answers.equipment.items,
    blockedPatterns: blockedPatternsFor(answers.limitations.injuries),
    avoidExerciseIds: answers.limitations.avoidExerciseIds,
  };
}

/** Exercises the athlete can actually do: equipment available, pattern not blocked, not avoided. */
function allowedExercises(rules: ProgramValidationContext) {
  return EXERCISES.filter(
    (exercise) =>
      exercise.equipment.every((item) => rules.availableEquipment.includes(item)) &&
      !rules.blockedPatterns.includes(exercise.pattern) &&
      !rules.avoidExerciseIds.includes(exercise.id),
  ).map(({ id, name, pattern, tracking }) => ({ id, name, pattern, tracking }));
}

export function buildProgramUserMessage(
  answers: OnboardingAnswers,
  profile: AthleteProfile,
  rules: ProgramValidationContext,
  today = new Date(),
): string {
  const context = {
    today: today.toISOString().slice(0, 10),
    athleteProfile: profile,
    schedule: answers.schedule,
    limitations: answers.limitations.injuries,
    athleteNotes: answers.notes,
    exercises: allowedExercises(rules),
  };
  return `Design the program for this athlete.\n\n${JSON.stringify(context, null, 2)}`;
}

export function buildRetryMessage(issues: readonly ProgramIssue[]): string {
  const list = issues.map((issue) => `- ${issue.path}: ${issue.message}`).join('\n');
  return `That program breaks these rules. Return a corrected program that fixes all of them:\n${list}`;
}

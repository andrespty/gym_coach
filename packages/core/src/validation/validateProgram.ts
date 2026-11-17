import type { Equipment } from '../catalog/equipment.ts';
import { findExercise } from '../catalog/exercises.ts';
import type { DayOfWeek } from '../schemas/common.ts';
import type { MovementPattern } from '../schemas/exercise.ts';
import type { PlannedBlock, ProgramDraft } from '../schemas/program.ts';

/** Allow sessions to run a little over the user's stated length before flagging them. */
const SESSION_LENGTH_TOLERANCE = 1.1;
const MAX_SETS_PER_BLOCK = 10;

export interface ProgramValidationContext {
  daysPerWeek: number;
  sessionMinutes: number;
  availableEquipment: readonly Equipment[];
  /** Movement patterns that must not appear (from injuries). */
  blockedPatterns: readonly MovementPattern[];
  avoidExerciseIds: readonly string[];
}

export interface ProgramIssue {
  path: string;
  message: string;
}

/**
 * Checks an AI-drafted program against hard rules. Issues are returned (not thrown) so they
 * can be sent back to the model to fix, or shown to the user.
 */
export function validateProgram(
  program: ProgramDraft,
  context: ProgramValidationContext,
): ProgramIssue[] {
  const issues: ProgramIssue[] = [];

  if (program.weeklySlots.length > context.daysPerWeek) {
    issues.push({
      path: 'weeklySlots',
      message: `Program has ${program.weeklySlots.length} training days; the user has ${context.daysPerWeek}.`,
    });
  }

  const seenDays = new Set<DayOfWeek>();
  program.weeklySlots.forEach((slot, slotIndex) => {
    const slotPath = `weeklySlots[${slotIndex}]`;

    if (seenDays.has(slot.day)) {
      issues.push({
        path: `${slotPath}.day`,
        message: `More than one session is scheduled on ${slot.day}.`,
      });
    }
    seenDays.add(slot.day);

    if (slot.estimatedMinutes > context.sessionMinutes * SESSION_LENGTH_TOLERANCE) {
      issues.push({
        path: `${slotPath}.estimatedMinutes`,
        message: `"${slot.title}" takes ${slot.estimatedMinutes} min; the user has ${context.sessionMinutes} min.`,
      });
    }

    slot.blocks.forEach((block, blockIndex) => {
      issues.push(...validateBlock(block, `${slotPath}.blocks[${blockIndex}]`, context));
    });
  });

  return issues;
}

function validateBlock(
  block: PlannedBlock,
  path: string,
  context: ProgramValidationContext,
): ProgramIssue[] {
  if (block.kind === 'free') return [];

  const issues: ProgramIssue[] = [];
  const exerciseIds =
    block.kind === 'timed' ? block.movements.map((m) => m.exerciseId) : [block.exerciseId];

  for (const exerciseId of exerciseIds) {
    issues.push(...validateExercise(exerciseId, path, context));
  }

  if (block.kind === 'sets') {
    if (block.sets < 1 || block.sets > MAX_SETS_PER_BLOCK) {
      issues.push({
        path: `${path}.sets`,
        message: `${block.sets} sets is outside 1–${MAX_SETS_PER_BLOCK}.`,
      });
    }
    if (block.repsMin < 1 || block.repsMin > block.repsMax) {
      issues.push({
        path: `${path}.repsMin`,
        message: `Invalid rep range ${block.repsMin}–${block.repsMax}.`,
      });
    }
  }

  return issues;
}

function validateExercise(
  exerciseId: string,
  path: string,
  context: ProgramValidationContext,
): ProgramIssue[] {
  const exercise = findExercise(exerciseId);
  if (!exercise) return [{ path, message: `Unknown exercise "${exerciseId}".` }];

  const issues: ProgramIssue[] = [];
  const missing = exercise.equipment.filter((item) => !context.availableEquipment.includes(item));
  if (missing.length > 0) {
    issues.push({
      path,
      message: `"${exercise.name}" needs equipment the user lacks: ${missing.join(', ')}.`,
    });
  }
  if (context.blockedPatterns.includes(exercise.pattern)) {
    issues.push({
      path,
      message: `"${exercise.name}" is a ${exercise.pattern} movement, blocked by an injury.`,
    });
  }
  if (context.avoidExerciseIds.includes(exercise.id)) {
    issues.push({ path, message: `The user asked to avoid "${exercise.name}".` });
  }
  return issues;
}

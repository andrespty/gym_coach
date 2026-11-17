import type { WeeklySlot, WeightUnit } from '@gym-coach/core';
import { Link } from 'react-router-dom';
import { Button, ErrorState, Icon } from '@/components/ui';
import { unitLabels } from '@/lib/units';
import { useRestTimer } from '../hooks/useRestTimer';
import { useSaveWorkout } from '../hooks/useSaveWorkout';
import { useWorkoutLog } from '../hooks/useWorkoutLog';
import { toWorkoutRecords } from '../model/workoutLog';
import { BlockLogger } from './BlockLogger';
import { RestTimerBar } from './RestTimerBar';

const BLOCK_LETTERS = 'ABCDEFGHIJ';
const REST_EXTENSION_SECONDS = 30;

interface WorkoutLoggerProps {
  programId: string;
  slot: WeeklySlot;
  unit: WeightUnit;
}

export function WorkoutLogger({ programId, slot, unit }: WorkoutLoggerProps) {
  const log = useWorkoutLog(slot);
  const timer = useRestTimer();
  const save = useSaveWorkout();
  const labels = unitLabels(unit);

  const finish = () =>
    save.mutate({ programId, slotDay: slot.day, ...toWorkoutRecords(slot, log.entries, unit) });

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-5 pb-32 pt-4">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to Today"
          className="flex size-11 items-center justify-center"
        >
          <Icon name="back" />
        </Link>
        <h1 className="text-lg font-semibold">{slot.title}</h1>
        <Button
          variant="secondary"
          onClick={finish}
          disabled={save.isPending}
          className="min-h-10 px-4 text-sm"
        >
          {save.isPending ? 'Saving…' : 'Finish'}
        </Button>
      </header>
      {save.error && <ErrorState error={save.error} />}

      {slot.blocks.map((block, index) => {
        const entry = log.entries[index];
        if (!entry) return null;
        return (
          <BlockLogger
            key={index}
            block={block}
            blockLetter={BLOCK_LETTERS[index] ?? String(index + 1)}
            entry={entry}
            weightUnit={labels.weight}
            distanceUnit={labels.distance}
            onChange={(next) => log.updateBlock(index, next)}
            onAddSet={() => log.addSet(index)}
            onSetComplete={timer.start}
          />
        );
      })}

      {timer.remaining !== null && (
        <RestTimerBar
          remaining={timer.remaining}
          onAdd={() => timer.addSeconds(REST_EXTENSION_SECONDS)}
          onSkip={timer.skip}
        />
      )}
    </main>
  );
}

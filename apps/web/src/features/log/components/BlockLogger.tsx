import type { PlannedBlock } from '@gym-coach/core';
import { Card, SectionLabel } from '@/components/ui';
import { describeBlock } from '@/lib/describeBlock';
import type { BlockEntry } from '../model/workoutLog';
import { CardioBlockLogger } from './CardioBlockLogger';
import { DoneToggle } from './DoneToggle';
import { SetsBlockLogger } from './SetsBlockLogger';
import { TimedBlockLogger } from './TimedBlockLogger';

interface BlockLoggerProps {
  block: PlannedBlock;
  blockLetter: string;
  entry: BlockEntry;
  weightUnit: string;
  distanceUnit: string;
  onChange: (entry: BlockEntry) => void;
  onAddSet: () => void;
  onSetComplete: (restSeconds: number) => void;
}

/** One block of the session: its target on top, the right inputs for its kind below. */
export function BlockLogger({
  block,
  blockLetter,
  entry,
  weightUnit,
  distanceUnit,
  onChange,
  onAddSet,
  onSetComplete,
}: BlockLoggerProps) {
  const { title, detail } = describeBlock(block);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <SectionLabel>Block {blockLetter}</SectionLabel>
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-ink-soft text-sm">Target {detail}</span>
      </div>

      {block.kind === 'sets' && entry.kind === 'sets' && (
        <SetsBlockLogger
          entry={entry}
          unit={weightUnit}
          restSeconds={block.restSeconds}
          onChange={onChange}
          onAddSet={onAddSet}
          onSetComplete={onSetComplete}
        />
      )}
      {block.kind === 'cardio' && entry.kind === 'cardio' && (
        <CardioBlockLogger entry={entry} distanceUnit={distanceUnit} onChange={onChange} />
      )}
      {block.kind === 'timed' && entry.kind === 'timed' && (
        <TimedBlockLogger entry={entry} format={block.format} onChange={onChange} />
      )}
      {block.kind === 'free' && entry.kind === 'free' && (
        <DoneToggle
          done={entry.done}
          label={`${title} done`}
          onToggle={() => onChange({ ...entry, done: !entry.done })}
        />
      )}
    </Card>
  );
}

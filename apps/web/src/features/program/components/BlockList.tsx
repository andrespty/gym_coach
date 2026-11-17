import type { PlannedBlock } from '@gym-coach/core';
import { describeBlock } from '@/lib/describeBlock';

const BLOCK_LETTERS = 'ABCDEFGHIJ';

/** Lettered list of a session's blocks: A Deadlift · 4 × 3–5 @ RPE 8. */
export function BlockList({ blocks }: { blocks: readonly PlannedBlock[] }) {
  return (
    <ol className="flex flex-col">
      {blocks.map((block, index) => {
        const { title, detail } = describeBlock(block);
        return (
          <li key={index} className="border-line-soft flex items-start gap-3 border-t py-2.5">
            <span className="bg-raised flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
              {BLOCK_LETTERS[index] ?? index + 1}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-semibold">{title}</span>
              <span className="text-muted text-sm">{detail}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

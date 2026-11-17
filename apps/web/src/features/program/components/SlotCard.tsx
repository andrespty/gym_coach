import type { WeeklySlot } from '@gym-coach/core';
import { Card, Chip, SectionLabel } from '@/components/ui';
import { BlockList } from './BlockList';

export function SlotCard({ slot }: { slot: WeeklySlot }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <SectionLabel>{slot.day}</SectionLabel>
        <Chip>{slot.estimatedMinutes} min</Chip>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{slot.title}</h2>
        <p className="text-ink-soft text-sm">{slot.intent}</p>
      </div>
      <BlockList blocks={slot.blocks} />
    </Card>
  );
}

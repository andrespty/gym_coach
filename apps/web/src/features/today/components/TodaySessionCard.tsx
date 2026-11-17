import type { WeeklySlot } from '@gym-coach/core';
import { Link } from 'react-router-dom';
import { BlockList } from '@/features/program';
import { Card, Chip } from '@/components/ui';

export function TodaySessionCard({ slot }: { slot: WeeklySlot }) {
  return (
    <Card className="flex flex-col gap-4 rounded-[20px] p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{slot.title}</h2>
        <div className="flex flex-wrap gap-2">
          <Chip>{slot.estimatedMinutes} min</Chip>
          {slot.servesGoals.map((goal) => (
            <Chip key={goal}>{goal.replace('_', ' ')}</Chip>
          ))}
        </div>
      </div>
      <BlockList blocks={slot.blocks} />
      <Link
        to="/log"
        className="bg-accent text-accent-ink min-h-13 flex items-center justify-center rounded-2xl text-base font-bold"
      >
        Start workout
      </Link>
    </Card>
  );
}

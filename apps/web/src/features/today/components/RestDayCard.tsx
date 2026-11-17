import { Card } from '@/components/ui';

export function RestDayCard() {
  return (
    <Card className="flex flex-col gap-2 p-5">
      <h2 className="text-xl font-semibold">Rest day</h2>
      <p className="text-ink-soft text-sm leading-relaxed">
        Nothing planned today. Recovery is part of the program: walk, stretch, sleep well.
      </p>
    </Card>
  );
}

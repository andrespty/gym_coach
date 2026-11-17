import { Button } from '@/components/ui';
import { formatDuration } from '@/lib/format';

interface RestTimerBarProps {
  remaining: number;
  onAdd: () => void;
  onSkip: () => void;
}

export function RestTimerBar({ remaining, onAdd, onSkip }: RestTimerBarProps) {
  return (
    <div
      role="timer"
      aria-live="off"
      className="border-line-soft bg-ground/95 fixed inset-x-0 bottom-0 border-t backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
        <div className="flex flex-col">
          <span className="text-muted text-xs font-semibold uppercase tracking-wider">Rest</span>
          <span className="font-mono text-3xl font-bold">{formatDuration(remaining)}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onAdd}>
            +30s
          </Button>
          <Button variant="secondary" onClick={onSkip}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

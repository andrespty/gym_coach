import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

interface DoneToggleProps {
  done: boolean;
  label: string;
  onToggle: () => void;
}

export function DoneToggle({ done, label, onToggle }: DoneToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={done}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-xl transition',
        done ? 'bg-accent text-accent-ink' : 'border-line text-muted border',
      )}
    >
      <Icon name="check" size={20} />
    </button>
  );
}

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="bg-line h-2 overflow-hidden rounded-full"
    >
      <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
    </div>
  );
}

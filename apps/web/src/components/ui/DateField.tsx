import { useId } from 'react';

interface DateFieldProps {
  label: string;
  /** YYYY-MM-DD, or '' for no date. */
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ label, value, onChange }: DateFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-surface border-line focus:border-accent h-12 rounded-xl border px-3 font-mono outline-none [color-scheme:dark]"
      />
    </div>
  );
}

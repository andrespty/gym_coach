import { useId } from 'react';

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  placeholder?: string;
  step?: number;
}

/** Numeric input that reports `null` when empty instead of 0 or NaN. */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  step = 1,
}: NumberFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <div className="bg-surface border-line focus-within:border-accent flex h-12 items-center rounded-xl border px-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value === '' ? null : Number(event.target.value))
          }
          className="w-full bg-transparent font-mono text-lg font-bold outline-none"
        />
        {unit && <span className="text-muted ml-2 text-sm">{unit}</span>}
      </div>
    </div>
  );
}

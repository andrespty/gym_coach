import { NumberField } from './NumberField';

interface DurationFieldProps {
  label: string;
  /** Total seconds, or null when empty. */
  value: number | null;
  onChange: (value: number | null) => void;
}

/** Minutes + seconds input for race and workout times. */
export function DurationField({ label, value, onChange }: DurationFieldProps) {
  const minutes = value === null ? null : Math.floor(value / 60);
  const seconds = value === null ? null : value % 60;

  const update = (nextMinutes: number | null, nextSeconds: number | null) => {
    if (nextMinutes === null && nextSeconds === null) onChange(null);
    else onChange((nextMinutes ?? 0) * 60 + (nextSeconds ?? 0));
  };

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="sr-only">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label={`${label} · min`}
          value={minutes}
          onChange={(m) => update(m, seconds)}
        />
        <NumberField label="sec" value={seconds} onChange={(s) => update(minutes, s)} />
      </div>
    </fieldset>
  );
}

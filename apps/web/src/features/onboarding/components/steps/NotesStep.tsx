import { NOTES_MAX_LENGTH } from '@gym-coach/core';
import { useId } from 'react';

interface NotesStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesStep({ value, onChange }: NotesStepProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-base font-semibold">
        Anything else your coach should know?
      </label>
      <p className="text-muted text-sm">Optional. For example: “I travel every other week.”</p>
      <textarea
        id={id}
        rows={4}
        maxLength={NOTES_MAX_LENGTH}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-surface border-line focus:border-accent rounded-xl border p-3 outline-none"
      />
      <span className="text-muted self-end font-mono text-xs">
        {value.length}/{NOTES_MAX_LENGTH}
      </span>
    </div>
  );
}

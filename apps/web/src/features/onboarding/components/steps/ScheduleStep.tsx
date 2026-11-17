import { DAYS_OF_WEEK, SESSION_LENGTH_OPTIONS, type DayOfWeek } from '@gym-coach/core';
import { ChoiceGroup, MultiChoiceGroup } from '@/components/ui';
import type { OnboardingDraft } from '../../model/draft';

type ScheduleDraft = OnboardingDraft['schedule'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const DAYS_PER_WEEK_CHOICES = [2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n} days`,
}));
const LENGTH_CHOICES = SESSION_LENGTH_OPTIONS.map((minutes) => ({
  value: String(minutes),
  label: `${minutes} minutes`,
}));
const DAY_CHOICES = DAYS_OF_WEEK.map((day) => ({ value: day, label: DAY_LABELS[day] }));

interface ScheduleStepProps {
  value: ScheduleDraft;
  onChange: (value: ScheduleDraft) => void;
}

export function ScheduleStep({ value, onChange }: ScheduleStepProps) {
  return (
    <>
      <ChoiceGroup
        label="How many days a week can you train?"
        choices={DAYS_PER_WEEK_CHOICES}
        value={value.daysPerWeek === null ? null : String(value.daysPerWeek)}
        onChange={(days) => onChange({ ...value, daysPerWeek: Number(days) })}
      />
      <ChoiceGroup
        label="How long is a session?"
        choices={LENGTH_CHOICES}
        value={value.sessionMinutes === null ? null : String(value.sessionMinutes)}
        onChange={(minutes) => onChange({ ...value, sessionMinutes: Number(minutes) })}
      />
      <MultiChoiceGroup
        label="Which days work best?"
        hint="Optional. The coach will try to use these."
        choices={DAY_CHOICES}
        values={value.preferredDays}
        onChange={(preferredDays) => onChange({ ...value, preferredDays })}
      />
    </>
  );
}

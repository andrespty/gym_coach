import { BODY_AREA_LABELS, type BodyArea } from '@gym-coach/core';
import { MultiChoiceGroup } from '@/components/ui';
import { toChoices } from '@/lib/choices';
import type { OnboardingDraft } from '../../model/draft';
import { LimitationEditor } from '../LimitationEditor';

type LimitationsDraft = OnboardingDraft['limitations'];

interface LimitationsStepProps {
  value: LimitationsDraft;
  onChange: (value: LimitationsDraft) => void;
}

export function LimitationsStep({ value, onChange }: LimitationsStepProps) {
  const areas = value.injuries.map((injury) => injury.area);

  const changeAreas = (nextAreas: BodyArea[]) =>
    onChange({
      ...value,
      injuries: nextAreas.map(
        (area) =>
          value.injuries.find((injury) => injury.area === area) ?? {
            area,
            severity: 'mild',
            when: 'during',
          },
      ),
    });

  return (
    <>
      <MultiChoiceGroup
        label="Anything that hurts or limits you?"
        hint="Skip this step if nothing does."
        choices={toChoices(BODY_AREA_LABELS)}
        values={areas}
        onChange={changeAreas}
      />
      {value.injuries.map((injury) => (
        <LimitationEditor
          key={injury.area}
          value={injury}
          onChange={(next) =>
            onChange({
              ...value,
              injuries: value.injuries.map((i) => (i.area === next.area ? next : i)),
            })
          }
        />
      ))}
    </>
  );
}

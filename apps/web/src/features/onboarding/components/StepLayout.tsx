import type { ReactNode } from 'react';
import { Button, Icon, ProgressBar } from '@/components/ui';

interface StepLayoutProps {
  title: string;
  stepNumber: number;
  totalSteps: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  canContinue?: boolean;
}

export function StepLayout({
  title,
  stepNumber,
  totalSteps,
  children,
  onBack,
  onNext,
  nextLabel = 'Continue',
  canContinue = true,
}: StepLayoutProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 pb-8 pt-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Previous step"
          className="text-ink flex size-11 items-center justify-center disabled:invisible"
        >
          <Icon name="back" />
        </button>
        <div className="flex-1">
          <ProgressBar
            value={stepNumber / totalSteps}
            label={`Step ${stepNumber} of ${totalSteps}`}
          />
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="flex flex-1 flex-col gap-6">{children}</div>

      {onNext && (
        <Button fullWidth onClick={onNext} disabled={!canContinue}>
          {nextLabel}
        </Button>
      )}
    </main>
  );
}

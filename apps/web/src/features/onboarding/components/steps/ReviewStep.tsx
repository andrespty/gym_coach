import type { AthleteProfile } from '@gym-coach/core';
import { Button, ErrorState, LoadingState } from '@/components/ui';
import { ProfileSummary } from '../ProfileSummary';

interface ReviewStepProps {
  profile: AthleteProfile | undefined;
  isGenerating: boolean;
  generateError: unknown;
  onRetry: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
  confirmError: unknown;
}

export function ReviewStep({
  profile,
  isGenerating,
  generateError,
  onRetry,
  onConfirm,
  isConfirming,
  confirmError,
}: ReviewStepProps) {
  if (isGenerating) return <LoadingState label="Your coach is reading your answers…" />;
  if (generateError || !profile) {
    return (
      <>
        <ErrorState error={generateError} />
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </>
    );
  }

  return (
    <>
      <ProfileSummary profile={profile} />
      <p className="text-muted text-sm">If something is wrong, go back and change your answers.</p>
      <Button fullWidth onClick={onConfirm} disabled={isConfirming}>
        {isConfirming ? 'Building your program…' : 'Looks right: build my program'}
      </Button>
      {Boolean(confirmError) && <ErrorState error={confirmError} />}
    </>
  );
}

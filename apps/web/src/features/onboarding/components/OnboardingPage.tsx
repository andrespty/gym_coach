import { useState } from 'react';
import { ErrorState } from '@/components/ui';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useOnboardingFlow } from '../hooks/useOnboardingFlow';
import { buildAnswers } from '../model/buildAnswers';
import { OnboardingStepContent } from './OnboardingStepContent';
import { StepLayout } from './StepLayout';
import { ReviewStep } from './steps/ReviewStep';

export function OnboardingPage() {
  const flow = useOnboardingFlow();
  const { generate, confirm } = useCoachProfile();
  const [issues, setIssues] = useState<string[]>([]);

  const requestProfile = () => {
    const result = buildAnswers(flow.draft);
    if (!result.success) {
      setIssues(result.issues);
      return;
    }
    setIssues([]);
    generate.mutate(result.answers);
    flow.next();
  };

  const stepId = flow.step.id;
  const isLastQuestion = stepId === 'notes';
  const isReview = stepId === 'review';

  return (
    <StepLayout
      title={flow.step.title}
      stepNumber={flow.stepIndex + 1}
      totalSteps={flow.totalSteps}
      onBack={flow.stepIndex > 0 ? flow.back : undefined}
      onNext={isReview ? undefined : isLastQuestion ? requestProfile : flow.next}
      nextLabel={isLastQuestion ? 'Send to my coach' : 'Continue'}
      canContinue={flow.canContinue}
    >
      {stepId === 'review' ? (
        <ReviewStep
          profile={generate.data}
          isGenerating={generate.isPending}
          generateError={generate.error}
          onRetry={requestProfile}
          onConfirm={() => confirm.mutate()}
          isConfirming={confirm.isPending}
          confirmError={confirm.error}
        />
      ) : (
        <OnboardingStepContent step={stepId} draft={flow.draft} update={flow.update} />
      )}
      {issues.length > 0 && (
        <ErrorState error={new Error(`Some answers need fixing: ${issues.join('; ')}`)} />
      )}
    </StepLayout>
  );
}

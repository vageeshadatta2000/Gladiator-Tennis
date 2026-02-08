'use client';

import { useMatchForm } from '@/context/MatchFormContext';
import { StepIndicator } from './StepIndicator';
import { OpponentStep } from './OpponentStep';
import { MatchDetailsStep } from './MatchDetailsStep';
import { ScoreStep } from './ScoreStep';
import { ReviewStep } from './ReviewStep';
import { ConfirmationState } from './ConfirmationState';

export function MatchForm() {
  const { currentStep, isSubmitted } = useMatchForm();

  // Show confirmation state after successful submission
  if (isSubmitted) {
    return <ConfirmationState />;
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <StepIndicator />

      {/* Render current step */}
      {currentStep === 1 && <OpponentStep />}
      {currentStep === 2 && <MatchDetailsStep />}
      {currentStep === 3 && <ScoreStep />}
      {currentStep === 4 && <ReviewStep />}
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MatchFormData, SetScore, Surface, MatchType, MatchResult, Opponent } from '@/types';

interface MatchFormContextType {
  // Form data
  formData: MatchFormData;
  updateFormData: (updates: Partial<MatchFormData>) => void;
  resetForm: () => void;

  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  totalSteps: number;

  // Submission state
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isSubmitted: boolean;
  setIsSubmitted: (value: boolean) => void;
  submittedMatch: SubmittedMatchInfo | null;
  setSubmittedMatch: (match: SubmittedMatchInfo | null) => void;

  // Error state
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
}

export interface SubmittedMatchInfo {
  id: string;
  opponent: Opponent;
  result: MatchResult;
  score: string;
  date: string;
}

const initialFormData: MatchFormData = {
  opponentName: '',
  opponentEmail: '',
  date: new Date().toISOString().split('T')[0],
  surface: 'hard',
  matchType: 'casual',
  sets: [
    { playerGames: 0, opponentGames: 0 },
    { playerGames: 0, opponentGames: 0 },
  ],
  result: 'won',
  notes: '',
};

const MatchFormContext = createContext<MatchFormContextType | undefined>(undefined);

export function MatchFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<MatchFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMatch, setSubmittedMatch] = useState<SubmittedMatchInfo | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalSteps = 4;

  const updateFormData = useCallback((updates: Partial<MatchFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmittedMatch(null);
    setSubmitError(null);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  return (
    <MatchFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetForm,
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        totalSteps,
        isSubmitting,
        setIsSubmitting,
        isSubmitted,
        setIsSubmitted,
        submittedMatch,
        setSubmittedMatch,
        submitError,
        setSubmitError,
      }}
    >
      {children}
    </MatchFormContext.Provider>
  );
}

export function useMatchForm() {
  const context = useContext(MatchFormContext);
  if (context === undefined) {
    throw new Error('useMatchForm must be used within a MatchFormProvider');
  }
  return context;
}

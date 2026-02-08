import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { MatchFormProvider, useMatchForm } from '@/context/MatchFormContext';

// Wrapper component for testing hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MatchFormProvider>{children}</MatchFormProvider>
);

describe('MatchFormContext', () => {
  describe('useMatchForm hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useMatchForm());
      }).toThrow('useMatchForm must be used within a MatchFormProvider');

      consoleSpy.mockRestore();
    });

    it('should provide initial form data', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      expect(result.current.formData.opponentName).toBe('');
      expect(result.current.formData.opponentEmail).toBe('');
      expect(result.current.formData.surface).toBe('hard');
      expect(result.current.formData.matchType).toBe('casual');
      expect(result.current.formData.sets).toHaveLength(2);
      expect(result.current.formData.result).toBe('won');
    });

    it('should provide initial step as 1', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.currentStep).toBe(1);
    });

    it('should have totalSteps as 4', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.totalSteps).toBe(4);
    });
  });

  describe('updateFormData', () => {
    it('should update opponent name', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ opponentName: 'John Doe' });
      });

      expect(result.current.formData.opponentName).toBe('John Doe');
    });

    it('should update opponent email', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ opponentEmail: 'john@example.com' });
      });

      expect(result.current.formData.opponentEmail).toBe('john@example.com');
    });

    it('should update surface', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ surface: 'clay' });
      });

      expect(result.current.formData.surface).toBe('clay');
    });

    it('should update match type', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ matchType: 'tournament' });
      });

      expect(result.current.formData.matchType).toBe('tournament');
    });

    it('should update sets', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      const newSets = [
        { playerGames: 6, opponentGames: 4 },
        { playerGames: 6, opponentGames: 3 },
      ];

      act(() => {
        result.current.updateFormData({ sets: newSets });
      });

      expect(result.current.formData.sets).toEqual(newSets);
    });

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({
          opponentName: 'Jane Smith',
          opponentEmail: 'jane@example.com',
          surface: 'grass',
        });
      });

      expect(result.current.formData.opponentName).toBe('Jane Smith');
      expect(result.current.formData.opponentEmail).toBe('jane@example.com');
      expect(result.current.formData.surface).toBe('grass');
    });

    it('should preserve other fields when updating', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.updateFormData({ opponentName: 'Test' });
      });

      act(() => {
        result.current.updateFormData({ opponentEmail: 'test@test.com' });
      });

      expect(result.current.formData.opponentName).toBe('Test');
      expect(result.current.formData.opponentEmail).toBe('test@test.com');
    });
  });

  describe('step navigation', () => {
    it('should navigate to next step', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should navigate to previous step', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(3);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should not go below step 1', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.prevStep();
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should not go above totalSteps', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(4);
    });

    it('should allow setting step directly', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.setCurrentStep(3);
      });

      expect(result.current.currentStep).toBe(3);
    });
  });

  describe('submission state', () => {
    it('should have initial isSubmitting as false', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should update isSubmitting', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.setIsSubmitting(true);
      });

      expect(result.current.isSubmitting).toBe(true);
    });

    it('should have initial isSubmitted as false', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.isSubmitted).toBe(false);
    });

    it('should update isSubmitted', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.setIsSubmitted(true);
      });

      expect(result.current.isSubmitted).toBe(true);
    });

    it('should have initial submittedMatch as null', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.submittedMatch).toBeNull();
    });

    it('should update submittedMatch', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      const matchInfo = {
        id: 'test-123',
        opponent: {
          name: 'Test',
          email: 'test@test.com',
          isGladiatorPlayer: false,
          inviteStatus: 'invited' as const,
        },
        result: 'won' as const,
        score: '6-4, 6-3',
        date: '2024-01-15',
      };

      act(() => {
        result.current.setSubmittedMatch(matchInfo);
      });

      expect(result.current.submittedMatch).toEqual(matchInfo);
    });
  });

  describe('error state', () => {
    it('should have initial submitError as null', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });
      expect(result.current.submitError).toBeNull();
    });

    it('should update submitError', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.setSubmitError('Network error');
      });

      expect(result.current.submitError).toBe('Network error');
    });

    it('should clear submitError', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      act(() => {
        result.current.setSubmitError('Error');
      });

      act(() => {
        result.current.setSubmitError(null);
      });

      expect(result.current.submitError).toBeNull();
    });
  });

  describe('resetForm', () => {
    it('should reset all form data to initial values', () => {
      const { result } = renderHook(() => useMatchForm(), { wrapper });

      // Modify form data
      act(() => {
        result.current.updateFormData({
          opponentName: 'Test User',
          opponentEmail: 'test@example.com',
          surface: 'clay',
          matchType: 'tournament',
        });
        result.current.setCurrentStep(3);
        result.current.setIsSubmitting(true);
        result.current.setIsSubmitted(true);
        result.current.setSubmitError('Some error');
      });

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formData.opponentName).toBe('');
      expect(result.current.formData.opponentEmail).toBe('');
      expect(result.current.formData.surface).toBe('hard');
      expect(result.current.formData.matchType).toBe('casual');
      expect(result.current.currentStep).toBe(1);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSubmitted).toBe(false);
      expect(result.current.submittedMatch).toBeNull();
      expect(result.current.submitError).toBeNull();
    });
  });
});

describe('MatchFormProvider', () => {
  it('should render children', () => {
    render(
      <MatchFormProvider>
        <div data-testid="child">Child Content</div>
      </MatchFormProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

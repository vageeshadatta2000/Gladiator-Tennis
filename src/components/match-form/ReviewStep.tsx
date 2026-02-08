'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatMatchScore } from '@/lib/tennis-validation';
import { addMatch, generateId, simulateApiCallWithError } from '@/lib/mock-data';
import { Match } from '@/types';
import { cn } from '@/lib/utils';

const surfaceLabels = {
  hard: 'Hard Court',
  clay: 'Clay Court',
  grass: 'Grass Court',
  indoor: 'Indoor',
};

const matchTypeLabels = {
  casual: 'Casual',
  competitive: 'Competitive',
  league: 'League',
  tournament: 'Tournament',
};

export function ReviewStep() {
  const {
    formData,
    updateFormData,
    prevStep,
    isSubmitting,
    setIsSubmitting,
    setIsSubmitted,
    setSubmittedMatch,
    submitError,
    setSubmitError,
  } = useMatchForm();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const match: Match = {
        id: generateId(),
        date: formData.date,
        opponent: {
          name: formData.opponentName,
          email: formData.opponentEmail,
          isGladiatorPlayer: false,
          inviteStatus: 'invited',
        },
        surface: formData.surface,
        matchType: formData.matchType,
        sets: formData.sets,
        result: formData.result,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      };

      await simulateApiCallWithError(match, false, 1500);
      addMatch(match);

      setSubmittedMatch({
        id: match.id,
        opponent: match.opponent,
        result: match.result,
        score: formatMatchScore(match.sets),
        date: match.date,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreDisplay = formatMatchScore(formData.sets);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Review Your Match</h2>
        <p className="text-slate-400 text-sm">
          Please confirm the details before submitting
        </p>
      </div>

      <div className="space-y-6">
        {/* Match Summary */}
        <div className="p-4 bg-slate-800/50 rounded-lg space-y-4 border border-slate-700">
          {/* Result Banner */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={cn(
              'p-4 rounded-lg text-center',
              formData.result === 'won'
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            )}
          >
            <span className={cn(
              'text-2xl font-bold',
              formData.result === 'won' ? 'text-green-400' : 'text-red-400'
            )}>
              {formData.result === 'won' ? 'Victory!' : 'Defeat'}
            </span>
            <div className="text-3xl font-bold mt-2 text-white">{scoreDisplay}</div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Opponent</span>
              <p className="font-medium text-white">{formData.opponentName}</p>
              <p className="text-slate-500 text-xs">{formData.opponentEmail}</p>
            </div>
            <div>
              <span className="text-slate-500">Date</span>
              <p className="font-medium text-white">
                {new Date(formData.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Surface</span>
              <p className="font-medium text-white">{surfaceLabels[formData.surface]}</p>
            </div>
            <div>
              <span className="text-slate-500">Match Type</span>
              <p className="font-medium text-white">{matchTypeLabels[formData.matchType]}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-300">Notes (optional)</Label>
          <Input
            id="notes"
            placeholder="Any notes about the match..."
            value={formData.notes || ''}
            onChange={e => updateFormData({ notes: e.target.value })}
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500"
          />
        </div>

        {/* Invite Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-cyan-300 font-medium">Opponent Invite</p>
              <p className="text-xs text-slate-400 mt-1">
                An invitation to join Gladiator Tennis will be sent to {formData.opponentEmail}.
                They'll be able to confirm this match result once they sign up.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-400 font-medium">Submission Failed</p>
                  <p className="text-xs text-slate-400 mt-1">{submitError}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50"
            >
              Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }} className="flex-1">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white glow-red-sm hover:glow-red disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Submitting...
                </span>
              ) : (
                'Submit Match'
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

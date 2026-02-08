'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SetScore } from '@/types';
import { isValidSetScore, validateMatchSets } from '@/lib/tennis-validation';
import { cn } from '@/lib/utils';

export function ScoreStep() {
  const { formData, updateFormData, nextStep, prevStep } = useMatchForm();
  const [setErrors, setSetErrors] = useState<(string | null)[]>([null, null, null]);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [needsThirdSet, setNeedsThirdSet] = useState(false);

  // Determine if third set is needed based on first two sets
  useEffect(() => {
    if (formData.sets.length >= 2) {
      const firstTwoSets = formData.sets.slice(0, 2);
      let playerWins = 0;
      let opponentWins = 0;

      for (const set of firstTwoSets) {
        if (set.playerGames > set.opponentGames) playerWins++;
        else if (set.opponentGames > set.playerGames) opponentWins++;
      }

      const needsThird = playerWins === 1 && opponentWins === 1;
      setNeedsThirdSet(needsThird);

      if (needsThird && formData.sets.length === 2) {
        updateFormData({
          sets: [...formData.sets, { playerGames: 0, opponentGames: 0 }],
        });
      } else if (!needsThird && formData.sets.length === 3) {
        updateFormData({
          sets: formData.sets.slice(0, 2),
        });
      }
    }
  }, [formData.sets[0]?.playerGames, formData.sets[0]?.opponentGames,
      formData.sets[1]?.playerGames, formData.sets[1]?.opponentGames]);

  const updateSetScore = (
    setIndex: number,
    field: 'playerGames' | 'opponentGames',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newSets = [...formData.sets];
    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]: numValue,
    };

    if (
      !(
        (newSets[setIndex].playerGames === 7 && newSets[setIndex].opponentGames === 6) ||
        (newSets[setIndex].playerGames === 6 && newSets[setIndex].opponentGames === 7)
      )
    ) {
      newSets[setIndex].tiebreak = undefined;
    }

    updateFormData({ sets: newSets });

    const newErrors = [...setErrors];
    newErrors[setIndex] = null;
    setSetErrors(newErrors);
    setMatchError(null);
  };

  const updateTiebreak = (
    setIndex: number,
    field: 'playerPoints' | 'opponentPoints',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newSets = [...formData.sets];
    newSets[setIndex] = {
      ...newSets[setIndex],
      tiebreak: {
        playerPoints: newSets[setIndex].tiebreak?.playerPoints || 0,
        opponentPoints: newSets[setIndex].tiebreak?.opponentPoints || 0,
        [field]: numValue,
      },
    };
    updateFormData({ sets: newSets });
  };

  const needsTiebreak = (set: SetScore): boolean => {
    return (
      (set.playerGames === 7 && set.opponentGames === 6) ||
      (set.playerGames === 6 && set.opponentGames === 7)
    );
  };

  const validateAndContinue = () => {
    const newSetErrors: (string | null)[] = [];
    let hasErrors = false;

    const setsToValidate = needsThirdSet ? formData.sets : formData.sets.slice(0, 2);

    for (let i = 0; i < setsToValidate.length; i++) {
      const validation = isValidSetScore(setsToValidate[i]);
      if (!validation.valid) {
        newSetErrors[i] = validation.error || 'Invalid set score';
        hasErrors = true;
      } else {
        newSetErrors[i] = null;
      }
    }

    setSetErrors(newSetErrors);

    if (hasErrors) return;

    const matchValidation = validateMatchSets(setsToValidate);
    if (!matchValidation.valid) {
      setMatchError(matchValidation.error || 'Invalid match score');
      return;
    }

    updateFormData({
      result: matchValidation.result!,
      sets: setsToValidate,
    });

    nextStep();
  };

  const setsToShow = needsThirdSet ? 3 : 2;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Match Score</h2>
        <p className="text-slate-400 text-sm">
          Enter the score for each set. You played against {formData.opponentName}.
        </p>
      </div>

      <div className="space-y-6">
        {/* Score Entry */}
        <div className="space-y-4">
          <AnimatePresence>
            {Array.from({ length: setsToShow }).map((_, setIndex) => (
              <motion.div
                key={setIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: setIndex * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all',
                  setErrors[setIndex]
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-slate-600 bg-slate-800/30'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">Set {setIndex + 1}</span>
                  {setIndex === 2 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30"
                    >
                      Deciding Set
                    </motion.span>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-3 items-center">
                  {/* Your Score */}
                  <div className="col-span-2">
                    <Label className="text-xs text-slate-400 mb-1 block">You</Label>
                    <Input
                      type="number"
                      min="0"
                      max="7"
                      value={formData.sets[setIndex]?.playerGames || ''}
                      onChange={e => updateSetScore(setIndex, 'playerGames', e.target.value)}
                      className="text-center text-lg font-semibold bg-slate-700/50 border-slate-600 text-white focus:border-red-500"
                      placeholder="0"
                    />
                  </div>

                  {/* VS */}
                  <div className="text-center text-slate-500 font-medium text-xl">-</div>

                  {/* Opponent Score */}
                  <div className="col-span-2">
                    <Label className="text-xs text-slate-400 mb-1 block">{formData.opponentName.split(' ')[0]}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="7"
                      value={formData.sets[setIndex]?.opponentGames || ''}
                      onChange={e => updateSetScore(setIndex, 'opponentGames', e.target.value)}
                      className="text-center text-lg font-semibold bg-slate-700/50 border-slate-600 text-white focus:border-red-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Tiebreak Entry */}
                <AnimatePresence>
                  {needsTiebreak(formData.sets[setIndex]) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-600"
                    >
                      <Label className="text-xs text-cyan-400 mb-2 block">Tiebreak Score</Label>
                      <div className="grid grid-cols-5 gap-3 items-center">
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.sets[setIndex]?.tiebreak?.playerPoints || ''}
                            onChange={e => updateTiebreak(setIndex, 'playerPoints', e.target.value)}
                            className="text-center bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="text-center text-cyan-400 text-xs font-medium">TB</div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.sets[setIndex]?.tiebreak?.opponentPoints || ''}
                            onChange={e => updateTiebreak(setIndex, 'opponentPoints', e.target.value)}
                            className="text-center bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {setErrors[setIndex] && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 mt-2"
                  >
                    {setErrors[setIndex]}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Match Error */}
        <AnimatePresence>
          {matchError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <p className="text-sm text-red-400">{matchError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tennis Score Help */}
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Valid set scores:</strong> 6-0, 6-1, 6-2, 6-3, 6-4, 7-5, or 7-6 (with tiebreak).
            The match is best of 3 sets.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              variant="outline"
              onClick={prevStep}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              onClick={validateAndContinue}
              className="w-full bg-red-600 hover:bg-red-700 text-white glow-red-sm hover:glow-red"
            >
              Review Match
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

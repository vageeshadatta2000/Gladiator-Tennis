'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Surface, MatchType } from '@/types';
import { cn } from '@/lib/utils';

const surfaces: { value: Surface; label: string; icon: string }[] = [
  { value: 'hard', label: 'Hard Court', icon: '🏟️' },
  { value: 'clay', label: 'Clay Court', icon: '🟤' },
  { value: 'grass', label: 'Grass Court', icon: '🌿' },
  { value: 'indoor', label: 'Indoor', icon: '🏢' },
];

const matchTypes: { value: MatchType; label: string; description: string }[] = [
  { value: 'casual', label: 'Casual', description: 'Friendly match, just for fun' },
  { value: 'competitive', label: 'Competitive', description: 'Serious match, counts for rankings' },
  { value: 'league', label: 'League', description: 'Part of a league competition' },
  { value: 'tournament', label: 'Tournament', description: 'Tournament match' },
];

export function MatchDetailsStep() {
  const { formData, updateFormData, nextStep, prevStep } = useMatchForm();
  const [errors, setErrors] = useState<{ date?: string }>({});

  const validateAndContinue = () => {
    const newErrors: { date?: string } = {};

    if (!formData.date) {
      newErrors.date = 'Match date is required';
    } else {
      const matchDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (matchDate > today) {
        newErrors.date = 'Match date cannot be in the future';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Match Details</h2>
        <p className="text-slate-400 text-sm">
          Tell us about the match conditions
        </p>
      </div>

      <div className="space-y-6">
        {/* Date Input */}
        <div className="space-y-2">
          <Label htmlFor="match-date" className="text-slate-300">When did you play?</Label>
          <Input
            id="match-date"
            type="date"
            value={formData.date}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => {
              updateFormData({ date: e.target.value });
              if (errors.date) setErrors({});
            }}
            className={cn(
              'bg-slate-800/50 border-slate-600 text-white focus:border-red-500 transition-colors scheme-dark',
              errors.date && 'border-red-500'
            )}
          />
          {errors.date && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {errors.date}
            </motion.p>
          )}
        </div>

        {/* Surface Selection */}
        <div className="space-y-3">
          <Label className="text-slate-300">Court Surface</Label>
          <div className="grid grid-cols-2 gap-3">
            {surfaces.map((surface, index) => (
              <motion.button
                key={surface.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => updateFormData({ surface: surface.value })}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all duration-200',
                  formData.surface === surface.value
                    ? 'border-red-500 bg-red-500/10 glow-red-sm'
                    : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                )}
              >
                <span className="text-xl mr-2">{surface.icon}</span>
                <span className={cn(
                  'font-medium',
                  formData.surface === surface.value ? 'text-white' : 'text-slate-300'
                )}>
                  {surface.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Match Type Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300">Match Type</Label>
          <Select
            value={formData.matchType}
            onValueChange={(value: MatchType) => updateFormData({ matchType: value })}
          >
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white focus:border-red-500">
              <SelectValue placeholder="Select match type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {matchTypes.map(type => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                >
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-slate-400">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              Continue to Score
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

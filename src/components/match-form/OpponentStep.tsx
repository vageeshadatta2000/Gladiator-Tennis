'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchPlayers, simulateApiCall } from '@/lib/mock-data';
import { MockPlayer } from '@/types';
import { cn } from '@/lib/utils';

export function OpponentStep() {
  const { formData, updateFormData, nextStep } = useMatchForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MockPlayer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<MockPlayer | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await simulateApiCall(searchPlayers(searchQuery), 300);
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectPlayer = (player: MockPlayer) => {
    setSelectedPlayer(player);
    updateFormData({
      opponentName: player.name,
      opponentEmail: player.email,
    });
    setSearchQuery(player.name);
    setShowResults(false);
    setErrors({});
  };

  const handleNewOpponent = () => {
    setSelectedPlayer(null);
    updateFormData({
      opponentName: searchQuery,
      opponentEmail: '',
    });
    setShowResults(false);
  };

  const validateAndContinue = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.opponentName.trim()) {
      newErrors.name = 'Opponent name is required';
    }

    if (!formData.opponentEmail.trim()) {
      newErrors.email = 'Email is required to send invite';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.opponentEmail)) {
      newErrors.email = 'Please enter a valid email address';
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
        <h2 className="text-xl font-semibold text-white mb-2">Who did you play against?</h2>
        <p className="text-slate-400 text-sm">
          Search for an existing Gladiator player or enter details for a new opponent
        </p>
      </div>

      <div className="space-y-6">
        {/* Search / Name Input */}
        <div className="space-y-2">
          <Label htmlFor="opponent-search" className="text-slate-300">Opponent Name</Label>
          <div className="relative">
            <Input
              id="opponent-search"
              placeholder="Search or enter opponent name..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSelectedPlayer(null);
                updateFormData({ opponentName: e.target.value });
              }}
              className={cn(
                'bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 transition-colors',
                errors.name && 'border-red-500'
              )}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-slate-500 border-t-red-500 rounded-full"
                />
              </div>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (searchResults.length > 0 || searchQuery.length >= 2) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-auto"
                >
                  {searchResults.map((player, index) => (
                    <motion.button
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-slate-700/50 border-b border-slate-700 last:border-b-0 transition-colors"
                      onClick={() => handleSelectPlayer(player)}
                    >
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-sm text-slate-400">{player.email}</div>
                      <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Gladiator Player • Rating: {player.rating}
                      </div>
                    </motion.button>
                  ))}
                  {searchQuery.length >= 2 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: searchResults.length * 0.05 }}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors"
                      onClick={handleNewOpponent}
                    >
                      <div className="font-medium text-red-400">+ Add "{searchQuery}" as new opponent</div>
                      <div className="text-sm text-slate-500">Not a Gladiator player yet</div>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {errors.name}
            </motion.p>
          )}
          {selectedPlayer && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-400 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Existing Gladiator player selected
            </motion.p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="opponent-email" className="text-slate-300">Opponent Email</Label>
          <Input
            id="opponent-email"
            type="email"
            placeholder="opponent@email.com"
            value={formData.opponentEmail}
            onChange={e => {
              updateFormData({ opponentEmail: e.target.value });
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            disabled={!!selectedPlayer}
            className={cn(
              'bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 transition-colors',
              errors.email && 'border-red-500',
              selectedPlayer && 'opacity-60'
            )}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {errors.email}
            </motion.p>
          )}
          {!selectedPlayer && formData.opponentName && (
            <p className="text-sm text-slate-500">
              An invite will be sent to this email to join Gladiator Tennis
            </p>
          )}
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={validateAndContinue}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-all glow-red-sm hover:glow-red"
            >
              Continue to Match Details
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Match } from '@/types';
import { getStoredMatches, simulateApiCall } from '@/lib/mock-data';
import { formatMatchScore } from '@/lib/tennis-validation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const surfaceLabels = {
  hard: 'Hard',
  clay: 'Clay',
  grass: 'Grass',
  indoor: 'Indoor',
};

const matchTypeLabels = {
  casual: 'Casual',
  competitive: 'Competitive',
  league: 'League',
  tournament: 'Tournament',
};

export function MatchHistory() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const storedMatches = await simulateApiCall(getStoredMatches(), 800);
        setMatches(storedMatches);
      } catch (err) {
        setError('Failed to load match history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-700 rounded" />
                <div className="h-4 w-24 bg-slate-700 rounded" />
              </div>
              <div className="h-8 w-20 bg-slate-700 rounded" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-16 bg-slate-700 rounded" />
              <div className="h-6 w-16 bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="glass-card rounded-xl p-6 border border-red-500/30 bg-red-500/10">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Matches</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty State
  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 border-2 border-dashed border-slate-600"
      >
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Matches Yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            You haven't logged any matches yet. Log your first match to start tracking your tennis journey!
          </p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white glow-red-sm hover:glow-red">
              Log Your First Match
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Match List
  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 bg-linear-to-r from-red-600/20 to-red-700/20 border border-red-500/30"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{matches.length}</div>
            <div className="text-sm text-slate-400">Total Matches</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">
              {matches.filter(m => m.result === 'won').length}
            </div>
            <div className="text-sm text-slate-400">Wins</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400">
              {matches.filter(m => m.result === 'lost').length}
            </div>
            <div className="text-sm text-slate-400">Losses</div>
          </div>
        </div>
      </motion.div>

      {/* Match Cards */}
      {matches.map((match, index) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.01 }}
          className="glass-card rounded-xl p-6 hover:border-slate-500 transition-all cursor-default"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{match.opponent.name}</span>
                {match.opponent.inviteStatus && (
                  <Badge
                    className={cn(
                      'text-xs',
                      match.opponent.inviteStatus === 'accepted'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    )}
                  >
                    {match.opponent.inviteStatus === 'accepted' ? 'Confirmed' : 'Pending'}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-slate-400">
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Result & Score */}
            <div className="text-right">
              <Badge
                className={cn(
                  'mb-1',
                  match.result === 'won'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                )}
              >
                {match.result === 'won' ? 'Won' : 'Lost'}
              </Badge>
              <div className="text-lg font-bold text-white">
                {formatMatchScore(match.sets)}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="text-xs bg-slate-700/50 text-slate-300 border border-slate-600">
              {surfaceLabels[match.surface]}
            </Badge>
            <Badge className="text-xs bg-slate-700/50 text-slate-300 border border-slate-600">
              {matchTypeLabels[match.matchType]}
            </Badge>
          </div>

          {/* Notes */}
          {match.notes && (
            <p className="mt-3 text-sm text-slate-400 italic">"{match.notes}"</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

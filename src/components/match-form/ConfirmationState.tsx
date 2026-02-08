'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InviteStatus } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ConfirmationState() {
  const { submittedMatch, resetForm } = useMatchForm();
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>('invited');

  useEffect(() => {
    const timer = setTimeout(() => {
      setInviteStatus('accepted');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!submittedMatch) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Success Banner */}
      <div className="glass-card rounded-xl p-6 sm:p-8 border border-green-500/30 bg-green-500/10">
        <div className="text-center">
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-green-400 mb-2"
          >
            Match Logged!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300"
          >
            Your {submittedMatch.result === 'won' ? 'victory' : 'match'} against{' '}
            {submittedMatch.opponent.name} has been recorded.
          </motion.p>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-slate-800/50 rounded-lg inline-block border border-slate-700"
          >
            <div className="text-3xl font-bold text-white">{submittedMatch.score}</div>
            <div className="text-sm text-slate-400 mt-1">
              {new Date(submittedMatch.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Opponent Invite Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-xl p-6 sm:p-8"
      >
        <h3 className="font-semibold text-white mb-4">Opponent Invitation</h3>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div>
            <p className="font-medium text-white">{submittedMatch.opponent.name}</p>
            <p className="text-sm text-slate-400">{submittedMatch.opponent.email}</p>
          </div>

          {/* Invite Status Badge */}
          <motion.div
            key={inviteStatus}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Badge
              className={cn(
                'px-3 py-1.5',
                inviteStatus === 'invited'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              )}
            >
              {inviteStatus === 'invited' ? (
                <span className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  Invited
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accepted
                </span>
              )}
            </Badge>
          </motion.div>
        </div>

        {/* Status Explanation */}
        <div className="mt-4 text-sm text-slate-400">
          {inviteStatus === 'invited' ? (
            <p>
              An invitation has been sent to {submittedMatch.opponent.email}. Once they
              join Gladiator Tennis, they'll be able to confirm this match result.
            </p>
          ) : (
            <p className="text-green-400">
              Great news! {submittedMatch.opponent.name} has joined Gladiator Tennis
              and confirmed this match result.
            </p>
          )}
        </div>

        {/* Status Timeline */}
        <div className="mt-6 space-y-3">
          {[
            { label: 'Match logged', sub: 'Just now', done: true },
            { label: 'Invitation sent', sub: inviteStatus === 'accepted' ? 'Accepted' : 'Pending response', done: true, pending: inviteStatus === 'invited' },
            { label: 'Match confirmed', sub: inviteStatus === 'accepted' ? 'Both players verified' : 'Waiting for opponent', done: inviteStatus === 'accepted' },
          ].map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                  step.done
                    ? step.pending
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                    : 'bg-slate-700'
                )}
              >
                {step.done ? (
                  step.pending ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn('text-sm font-medium', step.done ? 'text-white' : 'text-slate-500')}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">{step.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            variant="outline"
            onClick={resetForm}
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Log Another Match
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Link href="/history" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white glow-red-sm hover:glow-red">
              View Match History
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

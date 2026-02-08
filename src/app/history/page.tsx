'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { MatchHistory } from '@/components/MatchHistory';

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 sm:py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Match History
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Your recorded matches and results
            </p>
          </motion.div>

          {/* Match History */}
          <MatchHistory />
        </div>
      </main>
    </div>
  );
}

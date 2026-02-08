'use client';

import { motion } from 'framer-motion';
import { useMatchForm } from '@/context/MatchFormContext';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Opponent' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Score' },
  { number: 4, label: 'Review' },
];

export function StepIndicator() {
  const { currentStep } = useMatchForm();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                    currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : currentStep === step.number
                      ? 'bg-red-600 text-white glow-red-sm'
                      : 'bg-slate-700 text-slate-400'
                  )}
                >
                  {currentStep > step.number ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    step.number
                  )}
                </div>
                {currentStep === step.number && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-full border-2 border-red-400"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={cn(
                  'mt-2 text-xs font-medium hidden sm:block',
                  currentStep >= step.number ? 'text-white' : 'text-slate-500'
                )}
              >
                {step.label}
              </motion.span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-slate-700 relative overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-y-0 left-0 bg-green-600"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Gladiator Tennis logo component matching the brand
function GladiatorLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
      {/* Inner swoosh/wave design */}
      <path
        d="M12 20C12 15.5 15.5 12 20 12C24.5 12 28 15.5 28 20"
        stroke="#f8fafc"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 20C28 24.5 24.5 28 20 28C15.5 28 12 24.5 12 20"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Log Match', icon: '🎾' },
    { href: '/history', label: 'History', icon: '📊' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass-card border-b border-slate-700/50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <GladiatorLogo className="w-10 h-10" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-white tracking-tight">
                GLADIATOR
              </span>
              <span className="font-light text-lg text-slate-400 ml-1">
                TENNIS
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-red-600/20 rounded-lg border border-red-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* User Avatar Placeholder */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 sm:ml-4 w-9 h-9 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center cursor-pointer"
            >
              <span className="text-white font-semibold text-sm">V</span>
            </motion.div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Zap, Flame, Clock } from 'lucide-react';

interface ModeSelectorProps {
  onModeSelect: (mode: 'endless' | 'daily' | 'quickplay') => void;
}

const modes = [
  {
    id: 'endless',
    name: 'Endless',
    icon: Zap,
    description: 'Guess as many Pokémon as you can!',
    color: 'from-blue-500 to-blue-600',
    accentColor: 'text-blue-400',
    cardClass:
      'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50 hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-400/70 hover:shadow-blue-500/20',
  },
  {
    id: 'daily',
    name: 'Daily Challenge',
    icon: Flame,
    description: 'One new challenge every day',
    color: 'from-orange-500 to-red-600',
    accentColor: 'text-orange-400',
    cardClass:
      'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50 hover:from-orange-500/30 hover:to-orange-600/30 hover:border-orange-400/70 hover:shadow-orange-500/20',
  },
  {
    id: 'quickplay',
    name: 'Quick Play',
    icon: Clock,
    description: '3 random Pokémon, rapid fire',
    color: 'from-purple-500 to-purple-600',
    accentColor: 'text-purple-400',
    cardClass:
      'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50 hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-400/70 hover:shadow-purple-500/20',
  },
];

export default function ModeSelector({ onModeSelect }: ModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent px-4 sm:px-0"
      >
        Choose Your Mode
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeSelect(mode.id as 'endless' | 'daily' | 'quickplay')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-6 sm:p-8 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 group overflow-hidden shadow-md hover:shadow-xl ${mode.cardClass}`}
            >
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`mb-4 inline-block p-2 sm:p-3 rounded-lg bg-gradient-to-br ${mode.color}`}
                >
                  <Icon size={24} className="sm:w-[28px] sm:h-[28px] text-white" />
                </motion.div>

                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">{mode.description}</p>

                <div className="mt-6 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full border-2 ${mode.accentColor} border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartClick: () => void;
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-3xl mx-auto"
    >
      <motion.div
        className="mb-6 sm:mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-4">
          <div>
            <div className="text-4xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight sm:leading-normal">
              SHADOW DEX
            </div>
            <div className="text-xs sm:text-lg lg:text-xl text-blue-300/80 font-light tracking-widest">
              POKÉMON SHADOW GAME
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-slate-300 text-sm sm:text-lg mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0"
      >
        Test your Pokémon knowledge by guessing creatures from their silhouettes. 
        Each wrong guess reveals a hint. Can you guess them all?
      </motion.p>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0"
      >
        <div className="flex items-center gap-2 text-blue-300 text-xs sm:text-sm">
          <Zap size={16} className="sm:w-[20px] sm:h-[20px] text-blue-400" />
          <span>Endless Mode</span>
        </div>
        <div className="flex items-center gap-2 text-blue-300 text-xs sm:text-sm">
          <Sparkles size={16} className="sm:w-[20px] sm:h-[20px] text-purple-400" />
          <span>Daily Challenge</span>
        </div>
        <div className="flex items-center gap-2 text-blue-300 text-xs sm:text-sm">
          <Zap size={16} className="sm:w-[20px] sm:h-[20px] text-blue-400" />
          <span>Quick Play</span>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        onClick={onStartClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm sm:text-lg rounded-lg shadow-lg glow-effect transition-all duration-300"
      >
        START GAME
      </motion.button>

      {/* Bottom info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-8 sm:mt-12 text-slate-400 text-xs sm:text-sm px-4 sm:px-0"
      >
        Challenge yourself • Track your score • Climb the leaderboard
      </motion.p>
    </motion.div>
  );
}

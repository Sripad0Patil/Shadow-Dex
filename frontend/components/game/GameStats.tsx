'use client';

import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface GameStatsProps {
  score: number;
  streak: number;
}

export default function GameStats({ score, streak }: GameStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 sm:gap-4"
    >
      {/* Score */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
      >
        <Zap size={16} className="sm:w-[18px] sm:h-[18px] text-blue-400" />
        <div className="flex flex-col">
          <span className="text-xs text-blue-300 uppercase tracking-widest">Score</span>
          <span className="text-base sm:text-lg font-bold text-white">{score}</span>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
      >
        <Flame size={16} className="sm:w-[18px] sm:h-[18px] text-orange-400" />
        <div className="flex flex-col">
          <span className="text-xs text-orange-300 uppercase tracking-widest">Streak</span>
          <span className="text-base sm:text-lg font-bold text-white">{streak}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface HintSystemProps {
  hints: string[];
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
  revealedImage: boolean;
  roundCompleted: boolean;
}

export default function HintSystem({
  hints,
  hintsUsed,
  maxHints,
  onUseHint,
  revealedImage,
  roundCompleted,
}: HintSystemProps) {
  const chancesLeft = maxHints - hintsUsed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-4 sm:mb-6 px-4 sm:px-0"
    >
      {/* Hints Display */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-6 backdrop-blur-sm mb-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-1.5 sm:gap-2">
            <Lightbulb size={16} className="sm:w-[20px] sm:h-[20px] text-yellow-400" />
            <span>Hints ({hintsUsed}/{maxHints})</span>
          </h3>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {chancesLeft} {chancesLeft === 1 ? 'chance' : 'chances'} left
            </span>
            <button
              onClick={onUseHint}
              disabled={hintsUsed >= maxHints || revealedImage || roundCompleted}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 text-[10px] sm:text-sm"
            >
              Reveal Hint
            </button>
          </div>
        </div>

        {/* Hint Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          <AnimatePresence>
            {hints.map((hint, index) => {
              const isRevealed = index < hintsUsed;
              return (
                <motion.div
                  key={index}
                  initial={isRevealed ? { opacity: 0, y: -10 } : { opacity: 0.5 }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 ${
                    index === 4 ? 'xs:col-span-2' : ''
                  } ${
                    isRevealed
                      ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200'
                      : 'bg-slate-700/30 border-slate-700 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className={`text-xs sm:text-sm ${isRevealed ? 'font-medium' : 'line-through'}`}>
                      {isRevealed ? hint : '?????'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {hintsUsed >= maxHints && !roundCompleted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs sm:text-sm text-orange-300"
          >
            No chances left. Revealing answer...
          </motion.p>
        )}

        {hintsUsed >= maxHints && roundCompleted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs sm:text-sm text-slate-400"
          >
            All hints used for this Pokémon.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled: boolean;
  message: string;
  transitionMessage?: string | null;
}

export default function GuessInput({
  onGuess,
  disabled,
  message,
  transitionMessage,
}: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess);
      setGuess('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && !disabled) {
      handleSubmit(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Who's that Pokémon?"
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-800 border-2 border-blue-500/30 hover:border-blue-500/50 focus:border-blue-500 focus:outline-none rounded-lg text-white placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base sm:text-lg"
            autoFocus
          />
          <button
            type="submit"
            disabled={disabled || !guess.trim()}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
          >
            <Send size={18} className="sm:w-[20px] sm:h-[20px]" />
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center font-semibold py-2 px-4 rounded-lg text-sm sm:text-base ${
              message.includes('Correct')
                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                : message.includes('Out of chances')
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
            }`}
          >
            {message}
          </motion.div>
        )}

        {transitionMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs sm:text-sm text-slate-400"
          >
            {transitionMessage}
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}

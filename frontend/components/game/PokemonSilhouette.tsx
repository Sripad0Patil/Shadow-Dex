'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Pokemon } from '@/lib/context/GameContext';
import { getPokemonSpriteFallbackUrl } from '@/lib/utils/pokemon';
import { Eye, EyeOff } from 'lucide-react';

interface PokemonSilhouetteProps {
  pokemon: Pokemon | null;
  revealed: boolean;
  onReveal: () => void;
}

export default function PokemonSilhouette({
  pokemon,
  revealed,
  onReveal,
}: PokemonSilhouetteProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (pokemon) {
      setImageSrc(pokemon.imageUrl);
      setImageError(false);
    }
  }, [pokemon?.id, pokemon?.imageUrl]);

  if (!pokemon) return null;

  const handleImageError = () => {
    if (!imageError && pokemon) {
      setImageError(true);
      setImageSrc(getPokemonSpriteFallbackUrl(pokemon.id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-8 px-4 sm:px-0"
    >
      {/* Silhouette Display */}
      <div className="relative w-44 h-44 xs:w-56 xs:h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
        <motion.div
          className={`w-full h-full rounded-xl border-2 border-blue-500/30 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
            revealed
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
              : 'bg-slate-900/50'
          }`}
          animate={
            revealed
              ? {}
              : {
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                    '0 0 40px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                  ],
                }
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={pokemon.name}
              width={256}
              height={256}
              onError={handleImageError}
              className={`w-36 h-36 xs:w-48 xs:h-48 sm:w-64 sm:h-64 object-contain transition-all duration-300 ${
                revealed ? 'brightness-100' : 'brightness-0 dark:invert'
              }`}
            />
          )}
        </motion.div>

        {/* Reveal Button */}
        {!revealed && (
          <motion.button
            onClick={onReveal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg transition-all duration-300 z-20"
            title="Reveal answer"
          >
            <Eye size={18} className="sm:w-[20px] sm:h-[20px]" />
          </motion.button>
        )}

        {/* Revealed indicator */}
        {revealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/50"
          >
            <EyeOff size={16} />
          </motion.div>
        )}
      </div>

      {/* Info Text */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-xl font-bold text-white mb-2">{pokemon.name}</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {pokemon.types.map(type => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/50"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

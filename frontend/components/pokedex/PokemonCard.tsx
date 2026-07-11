'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPokemonSpriteFallbackUrl } from '@/lib/utils/pokemon';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  guessed: boolean;
  index: number;
}

interface PokemonDetails {
  height: number;
  weight: number;
  types: string[];
}

export default function PokemonCard({ id, name, imageUrl, guessed, index }: PokemonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(imageUrl);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isFlipped) {
      setIsFlipped(false);
    }
  }, [isMobile, isFlipped]);

  useEffect(() => {
    setImageSrc(imageUrl);
    setImageError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getPokemonSpriteFallbackUrl(id));
    }
  };

  useEffect(() => {
    // Fetch Pokemon details from PokéAPI when card is about to flip
    const fetchDetails = async () => {
      if (isFlipped && !isMobile && !details) {
        setLoading(true);
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          const data = await response.json();
          setDetails({
            height: data.height,
            weight: data.weight,
            types: data.types.map((t: any) => t.type.name),
          });
        } catch (error) {
          console.error('[v0] Failed to fetch Pokemon details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [isFlipped, isMobile, id, details]);

  const variants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => {
        if (!isMobile) {
          setIsFlipped(!isFlipped);
        }
      }}
      className={`h-full perspective ${isMobile ? 'cursor-default' : 'cursor-pointer'}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        variants={variants}
        initial="front"
        animate={isFlipped && !isMobile ? 'back' : 'front'}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Front Side */}
        <motion.div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 rounded-lg overflow-hidden border transition-all duration-300 ${
            guessed
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-slate-800/50 border-slate-700/50'
          }`}
        >
          <div className="h-full flex flex-col justify-between">
            {/* Pokemon Image */}
            <div className="aspect-square w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative flex-shrink-0">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={name}
                  width={120}
                  height={120}
                  onError={handleImageError}
                  className={`w-full h-full object-contain p-2 transition-all duration-300 ${
                    guessed ? 'brightness-100' : 'brightness-75 group-hover:brightness-90'
                  }`}
                />
              )}

              {/* Guessed Badge */}
              {guessed && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
                  <div className="text-green-300 font-bold text-[10px] sm:text-sm">✓ Guessed</div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex items-center justify-center p-1 sm:p-2 bg-slate-900/50 backdrop-blur-sm">
              <div className="text-[10px] sm:text-xs font-bold text-slate-300 text-center truncate capitalize w-full px-1">{name}</div>
            </div>
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div
          style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
          className="absolute inset-0 rounded-lg overflow-hidden border border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm"
        >
          <div className="h-full flex flex-col items-center justify-center p-1 sm:p-3 text-center overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : details ? (
              <>
                <div className="text-[9px] sm:text-xs font-bold text-blue-300 mb-0.5">#{id}</div>
                <h3 className="text-[11px] sm:text-sm font-bold text-white mb-1 truncate px-1 w-full capitalize">{name}</h3>

                <div className="space-y-1 w-full flex-shrink overflow-y-auto">
                  {/* Types */}
                  <div className="flex flex-wrap gap-0.5 justify-center px-1">
                    {details.types.map((type) => (
                      <span
                        key={type}
                        className="px-1 py-0 sm:px-1.5 bg-blue-500/30 border border-blue-500/50 rounded text-blue-200 text-[8px] sm:text-[10px] capitalize font-semibold"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Height & Weight */}
                  <div className="grid grid-cols-2 gap-0.5 sm:gap-1 mt-1">
                    <div className="bg-slate-800/30 rounded p-0.5 border border-slate-700/30 min-w-0">
                      <div className="text-slate-450 text-[8px] sm:text-[9px] truncate">Height</div>
                      <div className="text-blue-300 font-bold text-[9px] sm:text-xs">
                        {(details.height / 10).toFixed(1)}m
                      </div>
                    </div>
                    <div className="bg-slate-800/30 rounded p-0.5 border border-slate-700/30 min-w-0">
                      <div className="text-slate-450 text-[8px] sm:text-[9px] truncate">Weight</div>
                      <div className="text-blue-300 font-bold text-[9px] sm:text-xs">
                        {(details.weight / 10).toFixed(1)}kg
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] sm:text-[10px] text-slate-500 mt-1 flex-shrink-0">Click to flip</div>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

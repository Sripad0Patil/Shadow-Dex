'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/lib/context/GameContext';
import { useAuth } from '@/lib/context/AuthContext';
import { fetchRandomPokemon, fetchPokemonById } from '@/lib/utils/pokemon';
import {
  getDailyPokemonId,
  getTodayKey,
} from '@/lib/utils/daily';
import { startQuickPlayApi, finishQuickPlayApi } from '@/src/api/quickplay';
import { getDailyStatusApi, startDailyApi, finishDailyApi } from '@/src/api/daily';
import type { Pokemon } from '@/lib/context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import GameContainer from '@/components/game/GameContainer';
import PokemonSilhouette from '@/components/game/PokemonSilhouette';
import HintSystem from '@/components/game/HintSystem';
import GuessInput from '@/components/game/GuessInput';
import GameStats from '@/components/game/GameStats';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GameScreenProps {
  mode: 'endless' | 'daily' | 'quickplay';
}

const QUICK_PLAY_ROUNDS = 3;
const MAX_HINTS = 5;

export default function GameScreen({ mode }: GameScreenProps) {
  const router = useRouter();
  const { user, openAuthModal, refreshUser } = useAuth();
  const { currentSession, startGame, incrementScore, useHint, guessedCorrectly, endGame, setSessionStreak, resetStreak } = useGame();
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [dailyAlreadyPlayed, setDailyAlreadyPlayed] = useState(false);
  const [dailyResult, setDailyResult] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [revealedImage, setRevealedImage] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const roundCompletedRef = useRef(false);
  const hintsUsedRef = useRef(0);
  const hasInitializedRef = useRef(false);
  const hasLoggedCompletionRef = useRef(false);

  const maxRounds = mode === 'quickplay' ? QUICK_PLAY_ROUNDS : 1;
  const maxHints = MAX_HINTS;

  const generateHints = useCallback((pokemon: Pokemon) => {
    const hintArray = [
      `Type: ${pokemon.types.join('/')}`,
      `Generation: Gen ${pokemon.generation}`,
      `Starts with: ${pokemon.name[0]}`,
      `Length: ${pokemon.name.length} letters`,
      `ID: #${pokemon.id}`,
    ].slice(0, MAX_HINTS);
    setHints(hintArray);
  }, []);

  const loadNewPokemon = useCallback(async () => {
    setLoading(true);
    setHints([]);
    setHintsUsed(0);
    hintsUsedRef.current = 0;
    setRevealedImage(false);
    setMessage('');
    setTransitionMessage(null);
    roundCompletedRef.current = false;
    setRoundCompleted(false);

    const pokemon =
      mode === 'daily'
        ? await fetchPokemonById(getDailyPokemonId())
        : await fetchRandomPokemon();

    if (pokemon) {
      setCurrentPokemon(pokemon);
      generateHints(pokemon);
    }
    setLoading(false);
  }, [mode, generateHints]);

  // Guest restriction redirect
  useEffect(() => {
    if (mode !== 'endless' && !user) {
      openAuthModal();
      router.push('/');
    }
  }, [mode, user, router, openAuthModal]);

  // Backend session start + daily status check
  useEffect(() => {
    if (mode === 'endless' || !user || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initModeSession = async () => {
      try {
        if (mode === 'daily') {
          setLoading(true);
          const todayKey = getTodayKey();
          const status = await getDailyStatusApi(todayKey);
          if (status.completedToday) {
            setDailyAlreadyPlayed(true);
            setLoading(false);
            return;
          }

          const startRes = await startDailyApi(todayKey);
          if (startRes.alreadyPlayed) {
            setDailyAlreadyPlayed(true);
            setLoading(false);
            return;
          }
          startGame('daily', status.yesterdayStreak || 0);
        } else if (mode === 'quickplay') {
          await startQuickPlayApi();
          startGame('quickplay');
        }

        await loadNewPokemon();
      } catch (error) {
        console.error('Failed to initialize game session:', error);
        setLoading(false);
      }
    };

    initModeSession();
  }, [mode, user, loadNewPokemon, startGame]);

  // Backend session finish logger
  useEffect(() => {
    if (!currentSession || !currentSession.gameOver || mode === 'endless' || !user || hasLoggedCompletionRef.current) return;
    hasLoggedCompletionRef.current = true;

    const logGameCompletion = async () => {
      try {
        if (mode === 'quickplay') {
          await finishQuickPlayApi({
            score: currentSession.score,
            correctAnswers: currentSession.correctAnswers,
            hintsUsed: currentSession.hintsUsed,
          });
        } else if (mode === 'daily') {
          const res = await finishDailyApi({
            completed: currentSession.correctAnswers > 0,
            hintsUsed: currentSession.hintsUsed,
            date: getTodayKey(),
          });
          if (res.success && res.result) {
            setDailyResult(res.result);
          }
        }
        await refreshUser();
      } catch (error) {
        console.error('Failed to save game completion in backend:', error);
      }
    };

    logGameCompletion();
  }, [currentSession?.gameOver, mode, user, refreshUser]);

  useEffect(() => {
    if (mode !== 'endless') return; // daily/quickplay init handled above

    startGame('endless');
    loadNewPokemon();
  }, [mode, loadNewPokemon, startGame]);

  const finishRound = useCallback(() => {
    if (roundCompletedRef.current) return;
    roundCompletedRef.current = true;
    setRoundCompleted(true);

    const hasMoreRounds = mode === 'endless' || (mode === 'quickplay' && roundCount < maxRounds);

    if (hasMoreRounds) {
      setTransitionMessage('Next Pokémon coming up...');
      setTimeout(() => {
        if (mode === 'quickplay') {
          setRoundCount((prev) => prev + 1);
        }
        loadNewPokemon();
      }, 1500);
      return;
    }

    if (mode === 'daily') {
      setTransitionMessage('Daily challenge complete!');
    } else {
      setTransitionMessage('Challenge complete!');
    }

    endGame();
    setTimeout(() => setGameOver(true), 1500);
  }, [mode, roundCount, maxRounds, endGame, loadNewPokemon]);

  const consumeChance = useCallback(
    (reason: 'wrong' | 'manual') => {
      if (roundCompletedRef.current || !currentPokemon) return;

      const currentUsed = hintsUsedRef.current;
      if (currentUsed >= maxHints) return;

      const newHintsUsed = currentUsed + 1;
      hintsUsedRef.current = newHintsUsed;
      setHintsUsed(newHintsUsed);
      useHint();

      if (newHintsUsed >= maxHints) {
        setMessage(`Out of chances! It was ${currentPokemon.name}`);
        setRevealedImage(true);
        resetStreak(); // Reset the streak!

        const hasMoreRounds =
          mode === 'endless' || (mode === 'quickplay' && roundCount < maxRounds);
        if (hasMoreRounds) {
          setTransitionMessage('Next Pokémon coming up...');
        } else if (mode === 'daily') {
          setTransitionMessage('Daily challenge complete!');
        } else {
          setTransitionMessage('Challenge complete!');
        }

        setTimeout(() => finishRound(), 2000);
        return;
      }

      const msg =
        reason === 'wrong'
          ? `Wrong guess! Hint ${newHintsUsed}/${maxHints} revealed`
          : `Hint ${newHintsUsed}/${maxHints} revealed`;
      setMessage(msg);
      setTimeout(() => setMessage(''), 2000);
    },
    [currentPokemon, finishRound, useHint, mode, roundCount, maxRounds, maxHints, resetStreak]
  );

  const handleGuess = (guess: string) => {
    if (!currentPokemon || gameOver || roundCompletedRef.current) return;
    if (hintsUsedRef.current >= maxHints) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedName = currentPokemon.name.toLowerCase();

    if (normalizedGuess === normalizedName) {
      const isSequential = (currentSession?.streak || 0) > 0;
      const basePoints = 100 - hintsUsedRef.current * 20;
      const bonus = isSequential ? 20 : 0;
      const points = basePoints + bonus;

      incrementScore(points);
      guessedCorrectly();
      
      let msg = `Correct! +${basePoints} points`;
      if (isSequential) {
        msg += ` (+20 streak bonus!)`;
      }
      setMessage(msg);
      setRevealedImage(true);
      finishRound();
    } else {
      consumeChance('wrong');
    }
  };

  const handleRevealHint = () => {
    if (roundCompletedRef.current || hintsUsedRef.current >= maxHints) return;
    consumeChance('manual');
  };

  const handleReveal = () => {
    if (roundCompletedRef.current) return;
    setRevealedImage(true);
    resetStreak(); // Reset the streak!
    finishRound();
  };

  const roundLabel =
    mode === 'quickplay'
      ? `Round ${roundCount}/${maxRounds}`
      : mode === 'daily'
        ? 'Today\'s Challenge'
        : null;

  const gameOverTitle =
    mode === 'endless'
      ? 'Session Ended'
      : mode === 'daily'
        ? dailyAlreadyPlayed
          ? 'Already Played Today'
          : 'Daily Challenge Complete!'
        : 'Challenge Complete!';

  const gameOverSubtitle =
    mode === 'daily' && dailyAlreadyPlayed
      ? 'Come back tomorrow for a new challenge.'
      : null;

  return (
    <GameContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-sm sm:text-base"
          >
            <ChevronLeft size={18} className="sm:w-[20px] sm:h-[20px]" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="text-center px-2">
          <div className="text-[10px] sm:text-sm text-slate-400 uppercase tracking-widest font-semibold whitespace-nowrap">
            {mode === 'endless' ? 'Endless' : mode === 'daily' ? 'Daily Challenge' : 'Quick Play'}
          </div>
          {roundLabel && (
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{roundLabel}</div>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {mode !== 'endless' ? (
            <GameStats score={currentSession?.score || 0} streak={currentSession?.streak || 0} />
          ) : (
            <div className="w-8 sm:w-16"></div>
          )}
        </div>
      </div>

      {/* Game Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-96"
          >
            <div className="text-center">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-400">Loading Pokémon...</p>
            </div>
          </motion.div>
        ) : gameOver || dailyAlreadyPlayed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-4">{gameOverTitle}</h2>
              {gameOverSubtitle && (
                <p className="text-slate-400 mb-6">{gameOverSubtitle}</p>
              )}
              {!dailyAlreadyPlayed && mode !== 'endless' && (
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                    {mode === 'daily' && dailyResult ? dailyResult.score : (currentSession?.score || 0)} Points
                  </p>
                  {mode === 'daily' && dailyResult && (
                    <p className="text-lg text-slate-300 mb-8">
                      Daily Streak: <span className="font-extrabold text-orange-400">{dailyResult.streak} 🔥</span>
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 glow-effect"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentPokemon?.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto px-4 sm:px-0"
          >
            <PokemonSilhouette
              pokemon={currentPokemon}
              revealed={revealedImage}
              onReveal={handleReveal}
            />

            <HintSystem
              hints={hints}
              hintsUsed={hintsUsed}
              maxHints={maxHints}
              onUseHint={handleRevealHint}
              revealedImage={revealedImage}
              roundCompleted={roundCompleted}
            />

            <GuessInput
              onGuess={handleGuess}
              disabled={revealedImage || roundCompleted || hintsUsed >= maxHints}
              message={message}
              transitionMessage={transitionMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GameContainer>
  );
}

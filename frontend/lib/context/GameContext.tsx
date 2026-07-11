'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserStorageKey } from '@/lib/utils/storage';

export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  generation: number;
  types: string[];
}

export interface GameSession {
  id: string;
  mode: 'endless' | 'daily' | 'quickplay';
  userId?: string;
  currentPokemon: Pokemon | null;
  score: number;
  streak: number;
  correctAnswers: number;
  hintsUsed: number;
  gameOver: boolean;
  startTime: number;
  endTime?: number;
}

interface GameContextType {
  currentSession: GameSession | null;
  startGame: (mode: 'endless' | 'daily' | 'quickplay', initialStreak?: number) => void;
  endGame: () => void;
  incrementScore: (points: number) => void;
  useHint: () => void;
  guessedCorrectly: () => void;
  resetSession: () => void;
  setSessionStreak: (streak: number) => void;
  resetStreak: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);

  // Reset session when a different user logs in/out
  useEffect(() => {
    setCurrentSession(null);
  }, [user?.id]);

  const startGame = useCallback(
    (mode: 'endless' | 'daily' | 'quickplay', initialStreak: number = 0) => {
      const sessionId = `${mode}-${user?.id || 'guest'}-${Date.now()}`;
      setCurrentSession({
        id: sessionId,
        mode,
        userId: user?.id,
        currentPokemon: null,
        score: 0,
        streak: initialStreak,
        correctAnswers: 0,
        hintsUsed: 0,
        gameOver: false,
        startTime: Date.now(),
      });
    },
    [user?.id]
  );

  const endGame = useCallback(() => {
    setCurrentSession((prev) => {
      if (!prev) return null;

      const ended = { ...prev, gameOver: true, endTime: Date.now() };
      const historyKey = getUserStorageKey('gameHistory', prev.userId);
      const gameHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      gameHistory.push(ended);
      localStorage.setItem(historyKey, JSON.stringify(gameHistory));
      return ended;
    });
  }, []);

  const incrementScore = useCallback((points: number) => {
    setCurrentSession((prev) => (prev ? { ...prev, score: prev.score + points } : null));
  }, []);

  const useHint = useCallback(() => {
    setCurrentSession((prev) => (prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null));
  }, []);

  const guessedCorrectly = useCallback(() => {
    setCurrentSession((prev) => (prev ? { ...prev, streak: prev.streak + 1, correctAnswers: (prev.correctAnswers || 0) + 1 } : null));
  }, []);

  const setSessionStreak = useCallback((streak: number) => {
    setCurrentSession((prev) => (prev ? { ...prev, streak } : null));
  }, []);

  const resetStreak = useCallback(() => {
    setCurrentSession((prev) => (prev ? { ...prev, streak: 0 } : null));
  }, []);

  const resetSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentSession,
        startGame,
        endGame,
        incrementScore,
        useHint,
        guessedCorrectly,
        setSessionStreak,
        resetStreak,
        resetSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

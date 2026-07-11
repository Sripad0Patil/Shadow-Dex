'use client';

import { useState } from 'react';
import { useGame } from '@/lib/context/GameContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import ModeSelector from '@/components/sections/ModeSelector';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, LogOut, User as UserIcon } from 'lucide-react';

export default function Homepage() {
  const [showModes, setShowModes] = useState(false);
  const router = useRouter();
  const { startGame } = useGame();
  const { user, openAuthModal, logout } = useAuth();

  const handleModeSelect = (mode: 'endless' | 'daily' | 'quickplay') => {
    if (mode === 'endless') {
      startGame(mode);
      router.push(`/game/${mode}`);
    } else {
      if (user) {
        startGame(mode);
        router.push(`/game/${mode}`);
      } else {
        openAuthModal();
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 grid-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Top Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-0 left-0 right-0 z-20 p-2 sm:p-6 flex items-start justify-end gap-2 sm:gap-3"
      >

        <div className="flex flex-wrap gap-1.5 sm:gap-3 justify-end items-center max-w-full">
        <button
          onClick={() => router.push('/leaderboard')}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          <Trophy size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Leaderboard</span>
          <span className="xs:hidden">Board</span>
        </button>
        <button
          onClick={() => router.push('/pokedex')}
          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          <BookOpen size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline">Pokédex</span>
          <span className="xs:hidden">Dex</span>
        </button>

        {user ? (
          <>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              <UserIcon size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="max-w-[60px] sm:max-w-[120px] truncate">{user.username}</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
              title="Log Out"
            >
              <LogOut size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Log Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all duration-300 text-xs sm:text-sm shadow-md hover:shadow-lg glow-effect whitespace-nowrap"
          >
            <UserIcon size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Sign Up / Log In</span>
            <span className="xs:hidden">Login</span>
          </button>
        )}
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {!showModes ? (
          <HeroSection onStartClick={() => setShowModes(true)} />
        ) : (
          <ModeSelector onModeSelect={handleModeSelect} />
        )}
      </div>
    </main>
  );
}

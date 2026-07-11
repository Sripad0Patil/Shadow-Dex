'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameContainer from '@/components/game/GameContainer';
import { useAuth } from '@/lib/context/AuthContext';
import { getLeaderboardApi } from '@/src/api/leaderboard';
import { ChevronLeft, Trophy, Award, Target, Flame } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  totalGames: number;
  totalWins: number;
}

export default function Leaderboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<'quickplay' | 'daily'>('quickplay');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardApi(mode);
        if (data.success && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [mode]);

  // Determine top score (first rank on board)
  const topScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
  // Personal best score
  const personalBest = user
    ? mode === 'daily'
      ? (user.highestDailyScore || 0)
      : (user.highestQuickPlayScore || 0)
    : 0;

  return (
    <GameContainer>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 px-4 sm:px-0">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm sm:text-base"
        >
          <ChevronLeft size={18} className="sm:w-[20px] sm:h-[20px]" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent order-first sm:order-none">
          Leaderboard
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center mb-8 px-4 sm:px-0">
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 flex gap-2">
          <button
            onClick={() => setMode('quickplay')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              mode === 'quickplay'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quick Play
          </button>
          <button
            onClick={() => setMode('daily')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              mode === 'daily'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Challenge
          </button>
        </div>
      </div>

      {/* Stats Banner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
        {/* Top Score Banner */}
        <motion.div
          key={`top-${mode}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-5 flex items-center justify-center gap-4 h-full">
            <Trophy size={32} className="text-yellow-400 flex-shrink-0" />
            <div className="text-center">
              <div className="text-xs text-yellow-300 uppercase tracking-widest font-semibold">Global Best Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-yellow-300">{topScore}</div>
            </div>
          </div>
        </motion.div>

        {/* Personal Best Banner */}
        <motion.div
          key={`personal-${mode}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex items-center justify-center gap-4 h-full">
            <Target size={32} className="text-blue-400 flex-shrink-0" />
            <div className="text-center">
              <div className="text-xs text-blue-300 uppercase tracking-widest font-semibold font-sans">Your Personal Best</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-300">
                {user ? personalBest : 'Login to Save'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description Info */}
      <div className="mb-6 px-4 sm:px-0 text-slate-400 text-xs sm:text-sm">
        🛡️ Rankings are determined strictly by users' best single session score in <strong>{mode === 'daily' ? 'Daily Challenge' : 'Quick Play'}</strong> mode.
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-400 text-lg mb-4">No trainers on the board yet!</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Play Now
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 px-4 sm:px-0"
        >
          {leaderboard.map((entry, index) => {
            const isCurrentUser = user && user.id === entry.userId;
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 1) }}
                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                  isCurrentUser
                    ? 'bg-blue-500/20 border-blue-500/70 shadow-blue-500/10'
                    : index === 0
                    ? 'bg-yellow-500/10 border-yellow-500/50 shadow-yellow-500/5'
                    : index === 1
                    ? 'bg-gray-400/10 border-gray-400/50'
                    : index === 2
                    ? 'bg-orange-400/10 border-orange-400/50'
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {/* Rank Badge */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0 bg-gradient-to-br">
                  {index === 0 && (
                    <Trophy size={20} className="text-yellow-400 animate-bounce sm:w-[24px] sm:h-[24px]" style={{ animationDuration: '3s' }} />
                  )}
                  {index === 1 && (
                    <Award size={20} className="text-gray-300 sm:w-[24px] sm:h-[24px]" />
                  )}
                  {index === 2 && (
                    <Award size={20} className="text-orange-300 sm:w-[24px] sm:h-[24px]" />
                  )}
                  {index > 2 && (
                    <span className="text-slate-400">#{entry.rank}</span>
                  )}
                </div>

                {/* Entry Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                    <div className="text-sm sm:text-lg font-bold text-white truncate max-w-[100px] xs:max-w-[180px] sm:max-w-none capitalize" title={entry.username}>
                      {entry.username}
                    </div>
                    {isCurrentUser && <span className="text-[10px] sm:text-xs text-blue-400 font-semibold">(You)</span>}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-450 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>Games: <strong className="text-slate-350">{entry.totalGames}</strong></span>
                    <span>{mode === 'daily' ? 'Completed' : 'Perfect'}: <strong className="text-slate-350">{entry.totalWins}</strong></span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0 flex items-center gap-1 sm:gap-1.5 bg-slate-950/50 border border-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <Flame size={14} className={`sm:w-[16px] sm:h-[16px] ${index === 0 ? 'text-yellow-400' : 'text-blue-400'}`} />
                  <span className="text-xs sm:text-lg font-black text-white">{entry.score} <span className="text-[9px] sm:text-xs font-normal text-slate-400">pts</span></span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </GameContainer>
  );
}

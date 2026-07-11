'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameContainer from '@/components/game/GameContainer';
import { useAuth } from '@/lib/context/AuthContext';
import { getProfileApi } from '@/src/api/user';
import { ChevronLeft, BarChart3, Award, Zap, Target, HelpCircle, CheckCircle2 } from 'lucide-react';

interface ProfileStats {
  totalGames: number;
  bestScore: number;
  totalPoints: number;
  correctGuesses: number;
  hintsUsed: number;
  modeStats: {
    quickplay: { games: number; bestScore: number; totalPoints: number };
    daily: { games: number; completed: number; bestScore: number; totalPoints: number };
  };
}

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Enforce auth
  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal();
      router.push('/');
    }
  }, [user, authLoading, router, openAuthModal]);

  // Fetch stats from backend
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const data = await getProfileApi();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to load profile stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (authLoading || !user) {
    return (
      <GameContainer>
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </GameContainer>
    );
  }

  const perfectGamesCount = user.totalQuickPlayWins || 0;

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
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent order-first sm:order-none">
          Trainer Profile
        </h1>
        <div className="text-slate-400 text-xs sm:text-sm">
          Joined: <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</strong>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : !stats || stats.totalGames === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BarChart3 size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-400 text-lg mb-4">No competitive games played yet</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Play Now
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 px-4 sm:px-0">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap size={18} className="text-blue-400" />
                <span className="text-xs text-blue-300 uppercase tracking-widest font-semibold">Best Score</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.bestScore}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target size={18} className="text-green-400" />
                <span className="text-xs text-green-300 uppercase tracking-widest font-semibold">Total Points</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.totalPoints}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={18} className="text-purple-400" />
                <span className="text-xs text-purple-300 uppercase tracking-widest font-semibold">Total Games</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{stats.totalGames}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Award size={18} className="text-orange-400" />
                <span className="text-xs text-orange-300 uppercase tracking-widest font-semibold">Perfect Games</span>
              </div>
              <div className="text-3xl font-extrabold text-white">{perfectGamesCount}</div>
            </motion.div>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Play stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={20} className="text-purple-400" />
                Quick Play Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Games Played</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.quickplay.games}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Best Score</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.quickplay.bestScore} pts</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Total Points</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.quickplay.totalPoints} pts</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Avg Score</span>
                  <span className="text-white font-extrabold text-lg">
                    {stats.modeStats.quickplay.games > 0
                      ? `${Math.round(stats.modeStats.quickplay.totalPoints / stats.modeStats.quickplay.games)} pts`
                      : '0 pts'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Perfect Games Ratio</span>
                  <span className="text-white font-extrabold text-lg">
                    {stats.modeStats.quickplay.games > 0
                      ? `${Math.round((perfectGamesCount / stats.modeStats.quickplay.games) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Daily stats & Guess metrics */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-orange-400" />
                Daily Challenge Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Daily Challenges Played</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.daily.games}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Daily Challenges Completed</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.daily.completed}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Best Score</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.daily.bestScore || 0} pts</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">Total Points</span>
                  <span className="text-white font-extrabold text-lg">{stats.modeStats.daily.totalPoints || 0} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Hints Activated</span>
                  <span className="text-white font-extrabold text-lg flex items-center gap-1">
                    {stats.hintsUsed} hints
                    {stats.correctGuesses > 0 && (
                      <span className="text-xs text-slate-500 font-normal">
                        ({(stats.hintsUsed / stats.correctGuesses).toFixed(1)}/guess)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </GameContainer>
  );
}

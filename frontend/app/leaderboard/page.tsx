'use client';

import { useState, useEffect } from 'react';
import { GameProvider } from '@/lib/context/GameContext';
import Leaderboard from '@/components/pages/Leaderboard';

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GameProvider>
      <Leaderboard />
    </GameProvider>
  );
}

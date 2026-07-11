'use client';

import { useState, useEffect } from 'react';
import { GameProvider } from '@/lib/context/GameContext';
import Profile from '@/components/pages/Profile';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GameProvider>
      <Profile />
    </GameProvider>
  );
}

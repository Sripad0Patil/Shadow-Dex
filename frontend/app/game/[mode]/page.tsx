'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GameProvider } from '@/lib/context/GameContext';
import GameScreen from '@/components/pages/GameScreen';

export default function GamePage() {
  const params = useParams();
  const mode = params?.mode as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !mode) {
    return null;
  }

  return (
    <GameProvider>
      <GameScreen mode={mode as 'endless' | 'daily' | 'quickplay'} />
    </GameProvider>
  );
}

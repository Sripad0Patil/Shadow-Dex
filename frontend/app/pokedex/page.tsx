'use client';

import { useState, useEffect } from 'react';
import { GameProvider } from '@/lib/context/GameContext';
import Pokedex from '@/components/pages/Pokedex';

export default function PokedexPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GameProvider>
      <Pokedex />
    </GameProvider>
  );
}

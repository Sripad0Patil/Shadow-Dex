'use client';

import { GameProvider } from '@/lib/context/GameContext';
import Homepage from '@/components/pages/Homepage';

export default function Page() {
  return (
    <GameProvider>
      <Homepage />
    </GameProvider>
  );
}

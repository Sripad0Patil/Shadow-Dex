export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailyChallengeKey(): string {
  return `dailyChallenge_${getTodayKey()}`;
}

export function isDailyChallengeCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(getDailyChallengeKey()) === 'completed';
}

export function markDailyChallengeCompleted(): void {
  localStorage.setItem(getDailyChallengeKey(), 'completed');
}

export function getDailyPokemonId(): number {
  const dateStr = getTodayKey();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 1025) + 1;
}

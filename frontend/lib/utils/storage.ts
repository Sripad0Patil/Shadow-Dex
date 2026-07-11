export function getUserStorageKey(baseKey: string, userId?: string | null): string {
  return userId ? `${baseKey}_${userId}` : `${baseKey}_guest`;
}

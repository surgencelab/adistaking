export const qk = {
  pool: ['adi', 'pool'] as const,
  stats: ['adi', 'stats'] as const,
  composition: ['adi', 'composition'] as const,
  activity: ['adi', 'activity'] as const,
  volume: ['adi', 'volume'] as const,
  positions: (address?: string) => ['adi', 'positions', address ?? 'none'] as const,
  balance: (address?: string) => ['adi', 'balance', address ?? 'none'] as const,
};

/** Simulated chain latency so loading skeletons are exercised in mock mode. */
export const settle = <T,>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

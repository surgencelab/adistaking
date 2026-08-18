'use client';

import { useSyncExternalStore } from 'react';

/**
 * A shared one-second clock.
 *
 * Time-derived values (countdowns, lock progress, maturity) must not read
 * Date.now() during render — that is impure, and would only advance when
 * something else happened to re-render. This exposes the clock as an external
 * store instead, so countdowns tick on their own and SSR stays deterministic.
 *
 * Returns 0 until the first client tick, which is also the server snapshot, so
 * markup matches on hydration. Callers that would render nonsense at 0 are
 * already showing loading state at that point.
 */
const TICK_MS = 1_000;

let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => 0;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

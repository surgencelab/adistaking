import { LOCK_TERMS } from './config';
import type {
  ActivityEntry,
  CompositionSlice,
  LockTermDays,
  Position,
  PoolState,
  ProgramStats,
  VolumePoint,
} from './types';

/**
 * Mock data layer.
 *
 * Everything here is figures lifted from the design handoff screenshots. It is
 * a mutable in-memory store so claim / restake / unstake visibly change state
 * during a session, the same way the real contract would. Delete this file the
 * day NEXT_PUBLIC_STAKING_ADDRESS is set — nothing outside lib/hooks imports it.
 *
 * Position seed dates are relative to "now" so every UI state (early, mid-term,
 * matured) is reachable whenever the page is opened. That means a seeded
 * position can predate the displayed program start; real reads won't.
 */

const DAY_MS = 86_400_000;

export const PROGRAM_START = new Date('2026-07-28T00:00:00Z');
export const PROGRAM_END = new Date('2027-01-20T00:00:00Z');

const multiplierFor = (days: LockTermDays) =>
  LOCK_TERMS.find((t) => t.days === days)?.multiplier ?? 1;

function makePosition(
  id: number,
  amount: number,
  rewards: number,
  termDays: LockTermDays,
  daysAgo: number,
): Position {
  const now = Date.now();
  const openedAt = new Date(now - daysAgo * DAY_MS);
  const maturesAt = new Date(openedAt.getTime() + termDays * DAY_MS);
  const elapsed = now - openedAt.getTime();
  const progressPct = Math.min(100, Math.max(0, (elapsed / (termDays * DAY_MS)) * 100));
  return {
    id,
    amount,
    rewards,
    termDays,
    multiplier: multiplierFor(termDays),
    openedAt,
    maturesAt,
    progressPct,
    matured: now >= maturesAt.getTime(),
  };
}

function seedPositions(): Position[] {
  return [
    makePosition(128, 5_000, 78.4, 180, 25),
    makePosition(94, 1_200, 31.9, 90, 63),
    makePosition(61, 800, 14.2, 30, 35), // matured
  ];
}

interface MockStore {
  balance: number;
  allowance: number;
  positions: Position[];
  nextId: number;
  poolStaked: number;
}

const store: MockStore = {
  balance: 1_250,
  allowance: 0,
  positions: [],
  nextId: 200,
  poolStaked: 251_414.62,
};

export const mock = {
  balance: () => store.balance,
  allowance: () => store.allowance,

  approve() {
    store.allowance = Number.MAX_SAFE_INTEGER;
  },

  pool(): PoolState {
    return {
      staked: store.poolStaked,
      cap: 3_000_000,
      baseApyPct: 18,
      programStart: PROGRAM_START,
      programEnd: PROGRAM_END,
      stakers: 1_847,
      avgLockDays: 124,
    };
  },

  stats(): ProgramStats {
    const soonest = store.positions
      .filter((p) => !p.matured)
      .sort((a, b) => a.maturesAt.getTime() - b.maturesAt.getTime())[0];
    const nextUnlockAt =
      soonest?.maturesAt ?? new Date(Date.now() + (3 * 86_400 + 14 * 3_600) * 1000);
    return {
      rewardsPaid: 12_847,
      nextUnlockAt,
      nextUnlockAmount: soonest?.amount ?? 4_200,
      tvlUsd: 3_240_000,
      tvlAdi: store.poolStaked,
    };
  },

  composition(): CompositionSlice[] {
    return [
      { termDays: 30, pct: 18 },
      { termDays: 90, pct: 34 },
      { termDays: 180, pct: 48 },
    ];
  },

  activity(): ActivityEntry[] {
    const now = Date.now();
    return [
      { address: '0x9A4F2c81b7D14E09aF33517cC2B221', amount: 5_000, termDays: 180, at: new Date(now - 2 * 60_000) },
      { address: '0x3C8B90f2a5D77Ee41b0C4a8fD91E145', amount: 1_200, termDays: 90, at: new Date(now - 11 * 60_000) },
      { address: '0xF7810bC3d9e2A65f14Db77c05a3C0AA', amount: 800, termDays: 30, at: new Date(now - 42 * 60_000) },
      { address: '0x21D4e7Ab0c58F3319Ee6b21cA47D902', amount: 2_400, termDays: 180, at: new Date(now - 96 * 60_000) },
    ];
  },

  /** Daily series from program start to today. Deterministic — a seeded wobble
   *  rather than Math.random, so the line does not jump on every refetch. */
  volume(): VolumePoint[] {
    const wobble = (i: number) => {
      const x = Math.sin(i * 12.9898) * 43_758.5453;
      return x - Math.floor(x);
    };
    const days = Math.max(
      2,
      Math.floor((Date.now() - PROGRAM_START.getTime()) / DAY_MS) + 1,
    );
    const points: VolumePoint[] = [];
    for (let i = 0; i < days; i++) {
      const t = i / (days - 1);
      // Fast early ramp that flattens as the pool fills, plus a small daily wobble.
      const curve = 1 - Math.pow(1 - t, 2.2);
      const staked = store.poolStaked * (curve * 0.94 + wobble(i) * 0.06);
      points.push({
        at: new Date(PROGRAM_START.getTime() + i * DAY_MS),
        cumulativeStaked: staked,
        rewardsEarned: staked * 0.18 * t,
      });
    }
    // End the series on the live figure so the chart and the header agree.
    points[points.length - 1] = {
      at: new Date(),
      cumulativeStaked: store.poolStaked,
      rewardsEarned: store.poolStaked * 0.18,
    };
    return points;
  },

  positions(): Position[] {
    // Recompute progress on read so bars advance without a page reload.
    const now = Date.now();
    return store.positions.map((p) => {
      const elapsed = now - p.openedAt.getTime();
      const total = p.maturesAt.getTime() - p.openedAt.getTime();
      return {
        ...p,
        progressPct: Math.min(100, Math.max(0, (elapsed / total) * 100)),
        matured: now >= p.maturesAt.getTime(),
      };
    });
  },

  stake(amount: number, termDays: LockTermDays) {
    const openedAt = new Date();
    const maturesAt = new Date(openedAt.getTime() + termDays * DAY_MS);
    store.positions = [
      {
        id: store.nextId++,
        amount,
        rewards: 0,
        termDays,
        multiplier: multiplierFor(termDays),
        openedAt,
        maturesAt,
        progressPct: 0,
        matured: false,
      },
      ...store.positions,
    ];
    store.balance = Math.max(0, store.balance - amount);
    store.poolStaked += amount;
  },

  claim(ids: number[]) {
    let claimed = 0;
    store.positions = store.positions.map((p) => {
      if (!ids.includes(p.id)) return p;
      claimed += p.rewards;
      return { ...p, rewards: 0 };
    });
    store.balance += claimed;
    return claimed;
  },

  unstake(ids: number[]) {
    let returned = 0;
    store.positions = store.positions.filter((p) => {
      if (!ids.includes(p.id)) return true;
      returned += p.amount + p.rewards;
      store.poolStaked -= p.amount;
      return false;
    });
    store.balance += returned;
    return returned;
  },

  restake(ids: number[], termDays: LockTermDays) {
    const openedAt = new Date();
    store.positions = store.positions.map((p) => {
      if (!ids.includes(p.id)) return p;
      store.balance += p.rewards;
      return {
        ...p,
        rewards: 0,
        termDays,
        multiplier: multiplierFor(termDays),
        openedAt,
        maturesAt: new Date(openedAt.getTime() + termDays * DAY_MS),
        progressPct: 0,
        matured: false,
      };
    });
  },

  /** Demo-bar control: load a representative set of open + matured positions so
   *  the manage phase is reviewable without staking three times. */
  seed() {
    store.positions = seedPositions();
  },

  clearPositions() {
    store.positions = [];
  },

  reset() {
    store.balance = 1_250;
    store.allowance = 0;
    store.positions = [];
    store.poolStaked = 251_414.62;
  },
};

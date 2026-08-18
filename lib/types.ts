/** Shared domain types. These are the contract of the data layer: the UI reads
 *  only these shapes, so swapping mock data for real contract reads never
 *  touches a component. */

export type LockTermDays = 30 | 90 | 180;

export interface LockTerm {
  days: LockTermDays;
  /** Reward weighting applied to the position's share of the pool. */
  multiplier: number;
}

export interface PoolState {
  /** ADI currently staked across the whole program. */
  staked: number;
  /** Maximum ADI the pool accepts this program. */
  cap: number;
  /** Base pool APY as a percentage, e.g. 18 for ~18.00%. */
  baseApyPct: number;
  programStart: Date;
  programEnd: Date;
  stakers: number;
  /** Mean lock length across open positions, in days. */
  avgLockDays: number;
}

export interface ProgramStats {
  /** Cumulative ADI paid out since program start. */
  rewardsPaid: number;
  /** When the next position matures across the whole pool. */
  nextUnlockAt: Date;
  /** ADI releasing at that next unlock. */
  nextUnlockAmount: number;
  /** Total Value Locked in USD at the current ADI price. */
  tvlUsd: number;
}

export interface Position {
  id: number;
  /** Principal staked, in ADI. */
  amount: number;
  /** Rewards accrued and not yet claimed, in ADI. */
  rewards: number;
  termDays: LockTermDays;
  multiplier: number;
  openedAt: Date;
  maturesAt: Date;
  /** 0–100 progress through the lock term. */
  progressPct: number;
  matured: boolean;
}

export interface CompositionSlice {
  termDays: LockTermDays;
  pct: number;
}

export interface ActivityEntry {
  address: string;
  amount: number;
  termDays: LockTermDays;
  at: Date;
}

export interface VolumePoint {
  at: Date;
  cumulativeStaked: number;
  rewardsEarned: number;
}

/** Two-step stake flow: ERC-20 approval, then the stake itself. */
export type StakeStep = 'approve' | 'stake';
export type TxStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

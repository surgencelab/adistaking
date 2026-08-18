import type { Address } from 'viem';
import type { LockTerm } from './types';

/* ────────────────────────────────────────────────────────────────────────────
 * THE SWAP POINT
 *
 * Set NEXT_PUBLIC_STAKING_ADDRESS and NEXT_PUBLIC_TOKEN_ADDRESS and the whole
 * app stops reading mock data and starts reading the chain. Nothing else needs
 * to change: every hook in lib/hooks branches on MOCK_MODE, and no component
 * knows which side it is on.
 * ──────────────────────────────────────────────────────────────────────────── */

const ZERO = '0x0000000000000000000000000000000000000000' as const;

export const STAKING_ADDRESS = (process.env.NEXT_PUBLIC_STAKING_ADDRESS ?? ZERO) as Address;
export const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? ZERO) as Address;

/** No real contracts configured — serve the mock data layer. */
export const MOCK_MODE = STAKING_ADDRESS === ZERO || TOKEN_ADDRESS === ZERO;

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

/* ── Program parameters ──────────────────────────────────────────────────────
 * Defaults for local development. Once the staking contract is live these are
 * read from it (see usePool) rather than from this file. */

export const TOKEN_SYMBOL = 'ADI';
export const TOKEN_DECIMALS = 18;

/** Minimum principal for a new position, in ADI. */
export const MIN_STAKE = 100;

export const LOCK_TERMS: LockTerm[] = [
  { days: 30, multiplier: 0.58 },
  { days: 90, multiplier: 1.17 },
  { days: 180, multiplier: 1.75 },
];

export const DEFAULT_TERM_DAYS = 180;

/** Stand-in principal for the earnings estimate before an amount is entered and
 *  when no wallet balance is available to preview against. */
export const EXAMPLE_STAKE = 1_000;

/** Rough network fee hint shown under the stake form. */
export const EST_NETWORK_FEE = '~0.0004 ADI';

/* ── External links ────────────────────────────────────────────────────────── */
export const LINKS = {
  terms: '#',
  docs: '#',
  getAdi: 'https://bridge.adifoundation.ai/bridge',
  bridge: 'https://bridge.adifoundation.ai/bridge',
  audits: '#',
  dune: '#',
} as const;

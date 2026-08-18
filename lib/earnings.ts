/**
 * Staking earnings projection.
 *
 * One source of truth for the numbers shown in the stake form and the earnings
 * estimate, so the "at maturity" figure and the per-month / per-year figures can
 * never drift apart.
 *
 * These are projections at the current rate, not guarantees: the pool APY is
 * variable and adjusts as participation grows, and the lock multiplier is fixed
 * only at stake time.
 */

const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export interface EarningsEstimate {
  /** Base pool APY weighted by the term's lock multiplier. */
  apyPct: number;
  perMonth: number;
  perYear: number;
  atMaturity: number;
  /** The lock ends before a full year, so perYear is annualised, not attainable. */
  termEndsBeforeYear: boolean;
}

export function estimateEarnings(
  amount: number,
  baseApyPct: number,
  multiplier: number,
  termDays: number,
): EarningsEstimate {
  const apyPct = baseApyPct * multiplier;
  const perYear = (amount * apyPct) / 100;
  return {
    apyPct,
    perYear,
    perMonth: (perYear * DAYS_PER_MONTH) / DAYS_PER_YEAR,
    atMaturity: (perYear * termDays) / DAYS_PER_YEAR,
    termEndsBeforeYear: termDays < DAYS_PER_YEAR,
  };
}

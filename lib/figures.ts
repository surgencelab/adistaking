import { TOKEN_SYMBOL } from './config';
import { formatNumber } from './format';

/**
 * Figures are split into a value and a subordinate unit so the unit can be set
 * back typographically: "12,847" reads at full contrast, "ADI" recedes.
 *
 * The brand rule is that numbers always carry their units. This keeps the unit
 * without letting it compete with the number for attention.
 */
export interface SplitFigure {
  prefix?: string;
  value: string;
  unit?: string;
}

export function adiFigure(amount: number, decimals = 0): SplitFigure {
  return { value: formatNumber(amount, decimals), unit: TOKEN_SYMBOL };
}

/** Whole amounts drop the ".00"; fractional ones keep two places. */
export function adiFigureAuto(amount: number): SplitFigure {
  return adiFigure(amount, Number.isInteger(amount) ? 0 : 2);
}

export function usdFigure(amount: number): SplitFigure {
  if (amount >= 1_000_000_000) return { prefix: '$', value: (amount / 1e9).toFixed(2), unit: 'B' };
  if (amount >= 1_000_000) return { prefix: '$', value: (amount / 1e6).toFixed(2), unit: 'M' };
  if (amount >= 1_000) return { prefix: '$', value: (amount / 1e3).toFixed(2), unit: 'K' };
  return { prefix: '$', value: amount.toFixed(2) };
}

export function pctFigure(pct: number, approximate = true): SplitFigure {
  return { value: `${approximate ? '~' : ''}${pct.toFixed(2)}`, unit: '%' };
}

/** "3D 14H" — the unit letters recede, the digits carry. */
export function countdownFigure(totalSeconds: number): SplitFigure {
  if (totalSeconds <= 0) return { value: '0', unit: 'H' };
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  if (days > 0) return { value: `${days}D ${hours}`, unit: 'H' };
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  return { value: `${hours}H ${minutes}`, unit: 'M' };
}

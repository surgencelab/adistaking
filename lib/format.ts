import { TOKEN_SYMBOL } from './config';

/** Numbers carry units and separators — "12,847 ADI", "~18.00%", "$3.24M". */

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatAdi(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} ${TOKEN_SYMBOL}`;
}

/** Drops trailing ".00" — balances read "1,250 ADI" but "1,564.20 ADI". */
export function formatAdiAuto(value: number): string {
  return formatAdi(value, Number.isInteger(value) ? 0 : 2);
}

export function formatApy(pct: number): string {
  return `~${pct.toFixed(2)}%`;
}

export function formatUsdCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatAdiCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(0)}K`;
  return formatNumber(value, 2);
}

/** "3D 14H" — the countdown style used on the stat tiles. */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0H';
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  if (days > 0) return `${days}D ${hours}H`;
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  return `${hours}H ${minutes}M`;
}

/** "5mo 25d" — the program period style. */
export function formatDuration(from: Date, to: Date): string {
  const ms = Math.max(0, to.getTime() - from.getTime());
  const totalDays = Math.floor(ms / 86_400_000);
  const months = Math.floor(totalDays / 30.44);
  const days = Math.round(totalDays - months * 30.44);
  if (months <= 0) return `${totalDays}d`;
  return `${months}mo ${days}d`;
}

/** "28 Jul 2026" — used in the pool overview. */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "01/20/2027" — used in the positions table and stake form. */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

/** "2m ago", "11m ago", "3h ago". */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const seconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** 0x9A4F...B221 */
export function truncateAddress(address?: string, lead = 6, tail = 4): string {
  if (!address) return '';
  if (address.length <= lead + tail + 2) return address;
  return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}

/** Strip grouping separators from a user-typed amount. */
export function parseAmount(value: string): number {
  const n = parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

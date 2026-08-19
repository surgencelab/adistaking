'use client';

import { ArrowRight } from 'lucide-react';
import { Figure, Tooltip } from '@/components/ui';
import { TOKEN_SYMBOL } from '@/lib/config';
import { formatNumber } from '@/lib/format';
import { adiFigure } from '@/lib/figures';
import type { EarningsEstimate as Estimate } from '@/lib/earnings';

/**
 * Estimated rewards for the position about to be opened.
 *
 * Reads zero until an amount is entered, then shows each figure as a
 * transition — 0.00 → the new value. The before-state stays on screen so the
 * numbers read as a consequence of what the reader typed rather than as a
 * standalone claim about returns, and nothing is ever projected against a
 * balance the reader did not put into the field.
 */
function Row({
  label,
  after,
  hasAmount,
  tone = 'default',
}: {
  label: string;
  after: string;
  hasAmount: boolean;
  tone?: 'default' | 'positive';
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{label}</span>
      {hasAmount ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Figure figure={{ value: '0.00' }} size="sm" tone="muted" />
          <ArrowRight size={13} strokeWidth={2} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          <Figure figure={{ value: after, unit: TOKEN_SYMBOL }} size="sm" tone={tone} />
        </span>
      ) : (
        <Figure figure={{ value: '0.00', unit: TOKEN_SYMBOL }} size="sm" tone="muted" />
      )}
    </div>
  );
}

export function EarningsEstimate({
  estimate,
  principal,
  termDays,
  hasAmount,
}: {
  estimate: Estimate;
  principal: number;
  termDays: number;
  hasAmount: boolean;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-caps)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Estimated rewards
          <Tooltip text="Projected from the current pool APY. Rewards are variable and depend on total pool participation." />
        </span>
        <span style={{ font: '700 12px var(--font-condensed)', color: 'var(--text-muted)' }}>
          ~{estimate.apyPct.toFixed(2)}% APY
        </span>
      </div>

      <Row label="Amount staked" hasAmount={hasAmount} after={adiFigure(principal, 0).value} />
      <Row
        label="Per month"
        hasAmount={hasAmount}
        after={`~${formatNumber(estimate.perMonth, 1)}`}
        tone="positive"
      />
      <Row
        label="Per year"
        hasAmount={hasAmount}
        after={`~${formatNumber(estimate.perYear, 1)}`}
        tone="positive"
      />

      <p
        style={{
          font: 'var(--type-small)',
          color: 'var(--text-faint)',
          margin: 0,
          paddingTop: 12,
        }}
      >
        {hasAmount ? '' : 'Enter an amount to estimate rewards. '}
        APY is variable and these projections are not guaranteed.
        {hasAmount &&
          estimate.termEndsBeforeYear &&
          ` The ${termDays}-day term ends before a full year, so the yearly figure is annualised.`}
      </p>
    </div>
  );
}

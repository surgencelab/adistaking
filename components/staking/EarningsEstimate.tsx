'use client';

import { Figure, Tooltip } from '@/components/ui';
import { TOKEN_SYMBOL } from '@/lib/config';
import { formatAdiAuto, formatNumber } from '@/lib/format';
import type { EarningsEstimate as Estimate } from '@/lib/earnings';

/**
 * Estimated rewards for the amount currently in the stake form, per month and
 * per year.
 *
 * Reads zero until an amount is entered. Nothing is projected against the
 * wallet balance or a stand-in principal: an estimate the reader did not ask
 * for is an unsolicited return projection, and the zero state makes the figures
 * plainly a consequence of their own input.
 */
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
  const rows: [string, number][] = [
    ['Per month', hasAmount ? estimate.perMonth : 0],
    ['Per year', hasAmount ? estimate.perYear : 0],
  ];

  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{
              background: 'var(--surface-row)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                font: 'var(--type-label)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
              }}
            >
              {label}
            </span>
            <Figure
              figure={{
                value: hasAmount ? `~${formatNumber(value, 1)}` : '0.00',
                unit: TOKEN_SYMBOL,
              }}
              size="md"
              tone={hasAmount ? 'positive' : 'muted'}
            />
          </div>
        ))}
      </div>

      <p style={{ font: 'var(--type-small)', color: 'var(--text-faint)', margin: 0 }}>
        {hasAmount
          ? `Based on ${formatAdiAuto(principal)} at ~${estimate.apyPct.toFixed(2)}% APY.`
          : 'Enter an amount to estimate rewards.'}{' '}
        APY is variable and these projections are not guaranteed.
        {hasAmount &&
          estimate.termEndsBeforeYear &&
          ` The ${termDays}-day term ends before a full year, so the yearly figure is annualised.`}
      </p>
    </div>
  );
}

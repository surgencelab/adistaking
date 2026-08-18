'use client';

import { Figure, Tooltip } from '@/components/ui';
import { formatAdiAuto } from '@/lib/format';
import { adiFigure } from '@/lib/figures';
import type { EarningsEstimate as Estimate } from '@/lib/earnings';

/**
 * Monthly and annualised earnings for the amount currently in the stake form.
 *
 * Before an amount is entered it previews against the connected wallet's
 * balance, or a stand-in principal when disconnected — so the panel is never
 * empty and the reader can size the return before committing to a number.
 */
export function EarningsEstimate({
  estimate,
  principal,
  termDays,
  isExample,
  exampleSource,
}: {
  estimate: Estimate;
  principal: number;
  termDays: number;
  isExample: boolean;
  exampleSource: 'balance' | 'default';
}) {
  const rows: [string, number][] = [
    ['Per month', estimate.perMonth],
    ['Per year', estimate.perYear],
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
          Estimated earnings
          <Tooltip text="Projected from the current pool APY and the selected lock multiplier." />
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
            <Figure figure={{ ...adiFigure(value, 1), value: `~${adiFigure(value, 1).value}` }} size="md" tone="positive" />
          </div>
        ))}
      </div>

      <p style={{ font: 'var(--type-small)', color: 'var(--text-faint)', margin: 0 }}>
        {isExample
          ? exampleSource === 'balance'
            ? `Example based on your balance of ${formatAdiAuto(principal)}.`
            : `Example based on ${formatAdiAuto(principal)}.`
          : `Based on ${formatAdiAuto(principal)} at ~${estimate.apyPct.toFixed(2)}% APY.`}{' '}
        APY is variable.
        {estimate.termEndsBeforeYear && ` The ${termDays}-day term ends before a full year, so the yearly figure is annualised.`}
      </p>
    </div>
  );
}

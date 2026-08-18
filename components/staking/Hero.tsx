'use client';

import type { Position } from '@/lib/types';
import { formatAdi } from '@/lib/format';
import { PoolOverview } from './PoolOverview';

export function Hero({
  locked,
  positions,
  capReached,
}: {
  locked: boolean;
  positions: Position[];
  capReached?: boolean;
}) {
  const staked = positions.reduce((sum, p) => sum + p.amount, 0);
  const accrued = positions.reduce((sum, p) => sum + p.rewards, 0);
  const claimable = positions.filter((p) => p.matured).reduce((sum, p) => sum + p.rewards, 0);

  const summary: [string, string, boolean][] = [
    ['Your staked', formatAdi(staked), false],
    ['Rewards accumulated', formatAdi(accrued, 1), false],
    ['Claimable', formatAdi(claimable, 1), true],
  ];

  return (
    <section
      className="adi-hero"
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 44,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        <h1
          style={{
            font: 'var(--type-hero)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-heading)',
          }}
        >
          Stake <span style={{ color: 'var(--blue-500)' }}>ADI</span>
        </h1>
        <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: 0, maxWidth: 460 }}>
          The $ADI staking program allocates a fixed ecosystem participation incentive to time-locked positions on ADI
          Chain. Each position&rsquo;s share is weighted by lock duration, with principal and accrued rewards released
          at maturity.
        </p>
        {positions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 36, marginTop: 6 }}>
            {summary.map(([label, value, positive]) => (
              <div key={label}>
                <div
                  style={{
                    font: 'var(--type-label)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    font: 'var(--type-figure)',
                    color: positive ? 'var(--positive)' : 'var(--text-heading)',
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <PoolOverview locked={locked} capReached={capReached} />
    </section>
  );
}

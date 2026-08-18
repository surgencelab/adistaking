'use client';

import { Figure } from '@/components/ui';
import type { Position } from '@/lib/types';
import { adiFigure } from '@/lib/figures';
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

  const summary = [
    { label: 'Your staked', figure: adiFigure(staked), positive: false },
    { label: 'Rewards accumulated', figure: adiFigure(accrued, 1), positive: false },
    { label: 'Claimable', figure: adiFigure(claimable, 1), positive: true },
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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

        <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)', margin: '22px 0 0', maxWidth: 460 }}>
          The $ADI staking program allocates a fixed ecosystem participation incentive to time-locked positions on ADI
          Chain. Each position&rsquo;s share is weighted by lock duration, with principal and accrued rewards released
          at maturity.
        </p>

        {positions.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px 40px',
              marginTop: 34,
              paddingTop: 28,
              borderTop: '1px solid var(--border-subtle)',
              width: '100%',
            }}
          >
            {summary.map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    font: 'var(--type-label)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-caps)',
                  }}
                >
                  {s.label}
                </div>
                <Figure figure={s.figure} size="lg" tone={s.positive ? 'positive' : 'default'} />
              </div>
            ))}
          </div>
        )}
      </div>
      <PoolOverview locked={locked} capReached={capReached} />
    </section>
  );
}

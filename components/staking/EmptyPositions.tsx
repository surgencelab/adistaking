'use client';

import { Card } from '@/components/ui';
import { usePool } from '@/lib/hooks/usePoolData';
import { LOCK_TERMS, MIN_STAKE } from '@/lib/config';
import { formatAdi } from '@/lib/format';

export function EmptyPositions() {
  const { data: pool } = usePool();
  const baseApy = pool?.baseApyPct ?? 0;

  return (
    <Card title="Staking positions">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          padding: '26px 0 10px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            font: '700 15px var(--font-condensed)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-heading)',
          }}
        >
          No positions yet
        </div>
        <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0, maxWidth: 420 }}>
          Open your first position with the stake form. Minimum stake is{' '}
          <b style={{ color: 'var(--text-heading)' }}>{formatAdi(MIN_STAKE)}</b>; rewards accrue from the moment the
          position opens.
        </p>
        <div className="adi-tiles" style={{ width: '100%', marginTop: 6 }}>
          {LOCK_TERMS.map((t) => (
            <div
              key={t.days}
              style={{
                background: 'var(--surface-row)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  font: '700 15px var(--font-condensed)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-heading)',
                }}
              >
                {t.days} days
              </span>
              <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>
                {t.multiplier.toFixed(2)}x multiplier
              </span>
              <span style={{ font: '700 16px var(--font-condensed)', color: 'var(--positive)' }}>
                ~{(baseApy * t.multiplier).toFixed(2)}% APY
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

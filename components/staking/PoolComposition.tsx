'use client';

import { ArrowUpRight } from 'lucide-react';
import { Card, ProgressBar, SEGMENT_COLORS, Skeleton } from '@/components/ui';
import { useActivity, useComposition } from '@/lib/hooks/usePoolData';
import { LINKS } from '@/lib/config';
import { formatAdi, formatRelative, truncateAddress } from '@/lib/format';
import { Gated } from './Gated';

export function PoolComposition({ locked, label }: { locked: boolean; label: string }) {
  const { data: composition, isLoading: loadingComposition } = useComposition();
  const { data: activity, isLoading: loadingActivity } = useActivity();

  if (loadingComposition || loadingActivity || !composition || !activity) {
    return (
      <Card title="Pool composition">
        <Skeleton height={10} />
        <Skeleton height={54} />
        <Skeleton height={54} />
      </Card>
    );
  }

  return (
    <Gated locked={locked} label={label}>
      <Card
        title="Pool composition"
        style={locked ? { height: '100%', border: 'none', borderRadius: 0 } : undefined}
        actions={
          <a
            href={LINKS.dune}
            target="_blank"
            rel="noopener noreferrer"
            style={{ font: 'var(--type-small)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            View on Dune <ArrowUpRight size={13} strokeWidth={2} />
          </a>
        }
      >
        <ProgressBar segments={composition.map((s) => ({ pct: s.pct, label: `${s.termDays} days` }))} height={10} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: 'var(--type-small)',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {composition.map((s, i) => (
            <span key={s.termDays}>
              <span style={{ color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}>■</span> {s.termDays} days{' '}
              <b style={{ color: 'var(--text-heading)' }}>{s.pct}%</b>
            </span>
          ))}
        </div>

        <div
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Recent activity
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activity.map((a) => (
            <div
              key={`${a.address}-${a.at.getTime()}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'var(--surface-row)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
              }}
            >
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-muted)', flex: 1 }}>
                {truncateAddress(a.address)}
              </span>
              <span style={{ font: '700 14px var(--font-condensed)', color: 'var(--text-heading)' }}>
                +{formatAdi(a.amount)}
              </span>
              <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{a.termDays} days</span>
              <span style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>{formatRelative(a.at)}</span>
            </div>
          ))}
        </div>
      </Card>
    </Gated>
  );
}

'use client';

import type { ReactNode } from 'react';
import { ProgressBar, Skeleton, Tooltip } from '@/components/ui';
import { usePool } from '@/lib/hooks/usePoolData';
import { formatAdiCompact, formatApy, formatDateLong, formatDuration, formatNumber } from '@/lib/format';

function Row({ label, value, tip, blur }: { label: string; value: ReactNode; tip?: string; blur?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {label}
        {tip && <Tooltip text={tip} />}
      </span>
      <span
        style={{
          font: '600 14px var(--font-body)',
          color: 'var(--text-heading)',
          filter: blur ? 'blur(7px)' : 'none',
          userSelect: blur ? 'none' : 'auto',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function PoolOverview({ locked, capReached }: { locked: boolean; capReached?: boolean }) {
  const { data: pool, isLoading } = usePool();

  const shell = {
    background: 'var(--surface-inset)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
  } as const;

  if (isLoading || !pool) {
    return (
      <div style={{ ...shell, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton height={20} />
        <Skeleton height={7} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height={18} />
        ))}
      </div>
    );
  }

  const staked = capReached ? pool.cap : pool.staked;
  const fillPct = (staked / pool.cap) * 100;

  return (
    <div style={shell}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          ADI Staking Pool Cap <Tooltip text="Maximum ADI the pool accepts this program." />
        </span>
        <span style={{ font: '600 14px var(--font-body)', color: capReached ? 'var(--warning)' : 'var(--text-heading)' }}>
          {capReached ? formatAdiCompact(staked) : formatNumber(staked, 2)} / {formatAdiCompact(pool.cap)}
        </span>
      </div>

      <ProgressBar value={fillPct} height={7} label="Pool cap filled" />

      {capReached && (
        <div style={{ font: 'var(--type-small)', color: 'var(--warning)', marginTop: 8 }}>
          Pool cap reached — staking is closed for this program.
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <Row
          label="Current pool APY%"
          value={formatApy(pool.baseApyPct)}
          tip="Variable; adjusts as pool participation grows."
        />
        <Row
          label="Staking program Period"
          value={formatDuration(pool.programStart, pool.programEnd)}
          tip="Fixed program window."
        />
        <Row label="Program starts" value={formatDateLong(pool.programStart)} />
        <Row label="Program ends" value={formatDateLong(pool.programEnd)} />
        <Row label="Stakers" value={formatNumber(pool.stakers)} blur={locked} />
        <Row label="Avg lock" value={`${pool.avgLockDays} days`} blur={locked} />
      </div>
    </div>
  );
}

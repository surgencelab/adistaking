'use client';

import { Card, Skeleton } from '@/components/ui';
import { useVolume } from '@/lib/hooks/usePoolData';
import { formatDateLong } from '@/lib/format';

const W = 640;
const H = 200;
const P = 8;

export function VolumeChart() {
  const { data: series, isLoading } = useVolume();

  if (isLoading || !series?.length) {
    return (
      <Card title="Program volume">
        <Skeleton height={200} />
      </Card>
    );
  }

  const max = Math.max(...series.map((p) => Math.max(p.cumulativeStaked, p.rewardsEarned))) * 1.1 || 1;
  const points = (pick: (i: number) => number) =>
    series.map((_, i) => [P + (i * (W - 2 * P)) / (series.length - 1), H - P - (pick(i) / max) * (H - 2 * P)]);

  const line = (pts: number[][]) => `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L ')}`;
  const area = (pts: number[][]) => `${line(pts)} L ${W - P},${H - P} L ${P},${H - P} Z`;

  const staked = points((i) => series[i].cumulativeStaked);
  const rewards = points((i) => series[i].rewardsEarned);

  return (
    <Card
      title="Program volume"
      actions={
        <span style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>
          Indexer-backed series — placeholder until the data source exists
        </span>
      }
    >
      <div style={{ display: 'flex', gap: 20, font: 'var(--type-small)', color: 'var(--text-muted)' }}>
        <span>
          <span style={{ color: 'var(--blue-500)' }}>■</span> Cumulative staked
        </span>
        <span>
          <span style={{ color: 'var(--teal-400)' }}>■</span> Rewards earned
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative staked and rewards earned over the program" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={P} x2={W - P} y1={H * g} y2={H * g} stroke="var(--border-subtle)" strokeWidth="1" />
        ))}
        <path d={area(staked)} fill="rgba(46,91,255,0.18)" />
        <path d={line(staked)} fill="none" stroke="var(--blue-500)" strokeWidth="2" />
        <path d={area(rewards)} fill="rgba(43,228,192,0.14)" />
        <path d={line(rewards)} fill="none" stroke="var(--teal-400)" strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-small)', color: 'var(--text-faint)' }}>
        <span>{formatDateLong(series[0].at)}</span>
        <span>{formatDateLong(series[series.length - 1].at)}</span>
      </div>
    </Card>
  );
}

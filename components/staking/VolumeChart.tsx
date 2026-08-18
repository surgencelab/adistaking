'use client';

import { useMemo, useRef, useState } from 'react';
import { Card, Figure, Segmented, Skeleton } from '@/components/ui';
import { useVolume } from '@/lib/hooks/usePoolData';
import { adiFigure } from '@/lib/figures';
import { formatAdiCompact, formatDateLong, formatNumber } from '@/lib/format';
import type { VolumePoint } from '@/lib/types';

type Range = '7d' | '30d' | 'all';

const RANGES: { value: Range; label: string; days: number | null }[] = [
  { value: '7d', label: '1W', days: 7 },
  { value: '30d', label: '1M', days: 30 },
  { value: 'all', label: 'All', days: null },
];

const W = 720;
const H = 240;
const PAD_X = 4;
const PAD_TOP = 18;
const PAD_BOTTOM = 4;

/** Nearest round number at or above the series max, for the reference line. */
function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
}

export function VolumeChart() {
  const { data: series, isLoading } = useVolume();
  const [range, setRange] = useState<Range>('30d');
  const [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  const points = useMemo<VolumePoint[]>(() => {
    if (!series?.length) return [];
    const days = RANGES.find((r) => r.value === range)?.days;
    return days ? series.slice(Math.max(0, series.length - days)) : series;
  }, [series, range]);

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const ceiling = niceCeiling(Math.max(...points.map((p) => p.cumulativeStaked)));
    const x = (i: number) => PAD_X + (i * (W - PAD_X * 2)) / (points.length - 1);
    const y = (v: number) => PAD_TOP + (1 - v / ceiling) * (H - PAD_TOP - PAD_BOTTOM);

    const path = (pick: (p: VolumePoint) => number) =>
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(pick(p)).toFixed(2)}`).join(' ');

    const staked = path((p) => p.cumulativeStaked);
    return {
      ceiling,
      x,
      y,
      staked,
      rewards: path((p) => p.rewardsEarned),
      stakedArea: `${staked} L${x(points.length - 1).toFixed(2)},${H} L${PAD_X},${H} Z`,
    };
  }, [points]);

  if (isLoading || !geometry) {
    return (
      <Card title="Program volume">
        <Skeleton height={240} />
      </Card>
    );
  }

  const active = hover ?? points.length - 1;
  const shown = points[active];

  const onMove = (clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (points.length - 1)));
  };

  const activeX = geometry.x(active);
  const leftPct = (activeX / W) * 100;

  return (
    <Card>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span
            style={{
              font: 'var(--type-label)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-caps)',
            }}
          >
            Cumulative staked
          </span>
          <Figure figure={adiFigure(shown.cumulativeStaked, 0)} size="lg" />
          <span style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>
            {hover === null ? 'Today' : formatDateLong(shown.at)} · {formatNumber(shown.rewardsEarned, 0)} ADI rewards
            earned
          </span>
        </div>
        <Segmented options={RANGES.map(({ value, label }) => ({ value, label }))} value={range} onChange={setRange} />
      </header>

      <div
        ref={plotRef}
        style={{ position: 'relative', cursor: 'crosshair' }}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Cumulative ADI staked over the program"
          style={{ width: '100%', height: 240, display: 'block' }}
        >
          <defs>
            <linearGradient id="adiStakedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--blue-500)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--blue-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Reference line at the rounded ceiling, labelled inline at the right. */}
          <line
            x1={PAD_X}
            x2={W - PAD_X}
            y1={geometry.y(geometry.ceiling)}
            y2={geometry.y(geometry.ceiling)}
            stroke="var(--border-subtle)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          <path d={geometry.stakedArea} fill="url(#adiStakedFill)" />
          <path
            d={geometry.rewards}
            fill="none"
            stroke="var(--teal-400)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
            opacity="0.75"
          />
          <path
            d={geometry.staked}
            fill="none"
            stroke="var(--blue-500)"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {hover !== null && (
            <>
              <line
                x1={activeX}
                x2={activeX}
                y1={PAD_TOP}
                y2={H}
                stroke="var(--border-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={activeX}
                cy={geometry.y(shown.cumulativeStaked)}
                r="4"
                fill="var(--surface-card)"
                stroke="var(--blue-500)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            font: '600 11px var(--font-condensed)',
            color: 'var(--text-faint)',
            background: 'var(--surface-card)',
            paddingLeft: 8,
          }}
        >
          {formatAdiCompact(geometry.ceiling)} ADI
        </span>

        {hover !== null && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              left: `${leftPct}%`,
              transform: `translateX(${leftPct > 70 ? '-100%' : leftPct < 12 ? '0' : '-50%'})`,
              background: 'var(--navy-1000)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-pill)',
              padding: '5px 12px',
              font: '600 12px var(--font-condensed)',
              color: 'var(--text-heading)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: 'var(--shadow-raised)',
            }}
          >
            {formatAdiCompact(shown.cumulativeStaked)} ADI
          </span>
        )}
      </div>

      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 18, font: 'var(--type-small)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 12, height: 2, borderRadius: 2, background: 'var(--blue-500)' }} />
            Cumulative staked
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span
              style={{
                width: 12,
                height: 2,
                borderRadius: 2,
                background:
                  'repeating-linear-gradient(90deg, var(--teal-400) 0 3px, transparent 3px 6px)',
              }}
            />
            Rewards earned
          </span>
        </div>
        <div style={{ display: 'flex', gap: 14, font: 'var(--type-small)', color: 'var(--text-faint)' }}>
          <span>{formatDateLong(points[0].at)}</span>
          <span>—</span>
          <span>{formatDateLong(points[points.length - 1].at)}</span>
        </div>
      </footer>
    </Card>
  );
}

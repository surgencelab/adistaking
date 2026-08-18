import type { CSSProperties } from 'react';

export interface Segment {
  pct: number;
  color?: string;
  label?: string;
}

/** Indigo → blue → teal, the documented pool-composition ramp. */
export const SEGMENT_COLORS = ['#4859E0', 'var(--blue-500)', 'var(--teal-400)'];

export function ProgressBar({
  value = 0,
  max = 100,
  segments,
  height = 8,
  label,
  style,
}: {
  value?: number;
  max?: number;
  segments?: Segment[];
  height?: number;
  label?: string;
  style?: CSSProperties;
}) {
  if (segments) {
    return (
      <div
        style={{ height, borderRadius: 'var(--radius-pill)', overflow: 'hidden', display: 'flex', gap: 3, ...style }}
      >
        {segments.map((s, i) => (
          <div
            key={i}
            title={s.label}
            style={{ width: `${s.pct}%`, background: s.color ?? SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
          />
        ))}
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        height,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-track)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: 'var(--teal-400)',
          borderRadius: 'var(--radius-pill)',
          transition: 'width var(--dur-slow) var(--ease-standard)',
        }}
      />
    </div>
  );
}

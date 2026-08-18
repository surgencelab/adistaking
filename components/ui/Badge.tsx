import type { CSSProperties, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info' | 'accent';

const TONES: Record<BadgeTone, CSSProperties> = {
  neutral: {
    background: 'var(--surface-raised)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-subtle)',
  },
  positive: { background: 'var(--positive-tint)', color: 'var(--positive)' },
  negative: { background: 'var(--negative-tint)', color: 'var(--negative)' },
  warning: { background: 'var(--warning-tint)', color: 'var(--warning)' },
  info: { background: 'var(--info-tint)', color: 'var(--blue-300)' },
  accent: { background: 'var(--accent)', color: 'var(--text-on-accent)' },
};

export function Badge({
  tone = 'neutral',
  children,
  style,
}: {
  tone?: BadgeTone;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 'var(--radius-pill)',
        font: '600 11px var(--font-condensed)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        ...TONES[tone],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

import type { CSSProperties, ReactNode } from 'react';

/**
 * Label / figure / caption. The value slot carries no typography of its own so
 * callers pass a <Figure> and keep the two-tone numeral treatment; the label and
 * caption are deliberately quiet so the figure is the only loud thing here.
 */
export function StatCard({
  label,
  value,
  caption,
  style,
}: {
  label: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        ...style,
      }}
    >
      <div
        style={{
          font: 'var(--type-label)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {value}
        {caption && <div style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>{caption}</div>}
      </div>
    </div>
  );
}

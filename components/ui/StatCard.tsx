import type { CSSProperties, ReactNode } from 'react';

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
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
      <div style={{ font: 'var(--type-figure-lg)', color: 'var(--text-heading)', textTransform: 'uppercase' }}>
        {value}
      </div>
      {caption && <div style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{caption}</div>}
    </div>
  );
}

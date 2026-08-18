import type { CSSProperties, ReactNode } from 'react';

export function Card({
  title,
  actions,
  children,
  style,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        ...style,
      }}
    >
      {(title || actions) && (
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {title && (
            <h3
              style={{
                font: 'var(--type-section)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
                color: 'var(--text-heading)',
              }}
            >
              {title}
            </h3>
          )}
          {actions && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

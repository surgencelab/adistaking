import type { CSSProperties, ReactNode } from 'react';

export type ToastTone = 'info' | 'positive' | 'negative' | 'warning';

const BAR: Record<ToastTone, string> = {
  info: 'var(--blue-500)',
  positive: 'var(--teal-400)',
  negative: 'var(--red-500)',
  warning: 'var(--amber-500)',
};

export function Toast({
  tone = 'info',
  title,
  children,
  style,
}: {
  tone?: ToastTone;
  title?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-raised)',
        padding: '14px 16px',
        maxWidth: 380,
        animation: 'adiFadeUp var(--dur-base) var(--ease-standard)',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 8, height: 8, borderRadius: '50%', background: BAR[tone], marginTop: 5, flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title && <div style={{ font: '600 13px var(--font-body)', color: 'var(--text-heading)' }}>{title}</div>}
        <div style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{children}</div>
      </div>
    </div>
  );
}

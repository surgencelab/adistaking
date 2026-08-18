import type { ReactNode } from 'react';

/** Pre-connect disclosure gate: content is blurred and inert behind a label. */
export function Gated({ locked, label, children }: { locked: boolean; label: string; children: ReactNode }) {
  if (!locked) return <>{children}</>;
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ filter: 'blur(10px)', pointerEvents: 'none', userSelect: 'none', height: '100%' }} aria-hidden="true">
        {children}
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span
          style={{
            font: '700 13px var(--font-condensed)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-heading)',
            textAlign: 'center',
            padding: '0 16px',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

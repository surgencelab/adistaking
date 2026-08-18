import type { CSSProperties, ReactNode } from 'react';

export function Tag({
  children,
  onRemove,
  style,
}: {
  children?: ReactNode;
  onRemove?: () => void;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
        font: '500 12px var(--font-body)',
        color: 'var(--text-body)',
        ...style,
      }}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--text-faint)',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

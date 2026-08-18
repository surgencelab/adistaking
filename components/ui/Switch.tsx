'use client';

import type { CSSProperties, ReactNode } from 'react';

export function Switch({
  checked,
  onChange,
  label,
  ariaLabel,
  style,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  ariaLabel?: string;
  style?: CSSProperties;
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        font: 'var(--type-body)',
        color: 'var(--text-body)',
        ...style,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Toggle')}
        onClick={() => onChange?.(!checked)}
        style={{
          width: 38,
          height: 22,
          padding: 0,
          borderRadius: 999,
          border: 'none',
          background: checked ? 'var(--accent)' : 'var(--surface-track)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background var(--dur-base) var(--ease-standard)',
          display: 'inline-block',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left var(--dur-base) var(--ease-standard)',
          }}
        />
      </button>
      {label}
    </label>
  );
}

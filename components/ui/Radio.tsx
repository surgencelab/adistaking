'use client';

import type { CSSProperties, ReactNode } from 'react';

export function Radio({
  checked,
  onChange,
  label,
  style,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
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
        role="radio"
        aria-checked={checked}
        aria-label={typeof label === 'string' ? label : 'Option'}
        onClick={() => onChange?.(true)}
        style={{
          width: 20,
          height: 20,
          padding: 0,
          borderRadius: '50%',
          background: 'transparent',
          border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {checked && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
      </button>
      {label}
    </label>
  );
}

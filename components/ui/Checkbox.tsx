'use client';

import { Check } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

export function Checkbox({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled,
  style,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        font: 'var(--type-body)',
        color: 'var(--text-body)',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Select')}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        style={{
          width: 20,
          height: 20,
          padding: 0,
          flexShrink: 0,
          borderRadius: 6,
          background: checked ? 'var(--accent)' : 'transparent',
          border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background var(--dur-fast) var(--ease-standard)',
        }}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </button>
      {label}
    </label>
  );
}

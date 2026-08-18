'use client';

import { useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: ReactNode;
  hint?: ReactNode;
  suffix?: ReactNode;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

export function Input({ label, hint, suffix, style, inputStyle, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && (
        <span
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-caps)',
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface-inset)',
          border: `1px solid ${focused ? 'var(--blue-500)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          transition: 'border-color var(--dur-fast) var(--ease-standard)',
        }}
      >
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-heading)',
            font: 'var(--type-body)',
            ...inputStyle,
          }}
          {...rest}
        />
        {suffix}
      </span>
      {hint && <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}

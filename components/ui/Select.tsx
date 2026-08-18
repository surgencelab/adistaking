'use client';

import { ChevronDown } from 'lucide-react';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export function Select({
  label,
  options,
  value,
  onChange,
  style,
}: {
  label?: ReactNode;
  options: { value: string; label: string }[];
  value: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  style?: CSSProperties;
}) {
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
      <span style={{ position: 'relative', display: 'block' }}>
        <select
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            appearance: 'none',
            background: 'var(--surface-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 36px 12px 14px',
            color: 'var(--text-heading)',
            font: 'var(--type-body)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            display: 'inline-flex',
          }}
        >
          <ChevronDown size={15} strokeWidth={1.75} />
        </span>
      </span>
    </label>
  );
}

'use client';

import { Check } from 'lucide-react';
import type { CSSProperties } from 'react';

export interface DurationOption<T extends string | number = string> {
  value: T;
  label: string;
  sub?: string;
}

export function DurationSelector<T extends string | number>({
  options,
  value,
  onChange,
  disabled,
  style,
}: {
  options: DurationOption<T>[];
  value: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      role="radiogroup"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`, gap: 10, ...style }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={o.sub ? `${o.label}, ${o.sub}` : o.label}
            disabled={disabled}
            onClick={() => onChange?.(o.value)}
            style={{
              position: 'relative',
              background: selected ? 'var(--surface-inset)' : 'var(--surface-raised)',
              border: `1px solid ${selected ? 'var(--border-selected)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '14px 8px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'center',
              transition: 'border-color var(--dur-fast) var(--ease-standard)',
            }}
          >
            <span style={{ font: '700 16px var(--font-condensed)', textTransform: 'uppercase', color: 'var(--text-heading)' }}>
              {o.label}
            </span>
            {o.sub && <span style={{ font: '400 11px var(--font-body)', color: 'var(--text-muted)' }}>{o.sub}</span>}
            {selected && (
              <span style={{ position: 'absolute', top: 4, right: 5, color: 'var(--text-heading)', display: 'inline-flex' }}>
                <Check size={12} strokeWidth={2.5} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

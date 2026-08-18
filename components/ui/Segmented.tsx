'use client';

import type { CSSProperties } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

/**
 * Compact filter control — range pickers and denomination switches. Distinct
 * from Tabs, which switches content panels; this filters the panel you are
 * already looking at, so it is quieter and sits inline with a card header.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        background: 'var(--surface-inset)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        padding: 3,
        gap: 2,
        ...style,
      }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
              background: selected ? 'var(--surface-raised)' : 'transparent',
              boxShadow: selected ? 'var(--shadow-card)' : 'none',
              color: selected ? 'var(--text-heading)' : 'var(--text-muted)',
              font: '600 11px var(--font-condensed)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

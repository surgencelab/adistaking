'use client';

import type { CSSProperties } from 'react';

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: {
  tabs: TabItem<T>[];
  value: T;
  onChange?: (value: T) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 4,
        gap: 2,
        ...style,
      }}
    >
      {tabs.map((t) => {
        const selected = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange?.(t.value)}
            style={{
              padding: '9px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: selected ? 'var(--navy-1000)' : 'transparent',
              color: selected ? 'var(--text-heading)' : 'var(--text-muted)',
              font: '700 12px var(--font-condensed)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              transition: 'background var(--dur-fast) var(--ease-standard)',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

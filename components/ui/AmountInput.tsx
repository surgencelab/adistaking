'use client';

import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export function AmountInput({
  label = 'Staking amount',
  balance,
  value,
  onChange,
  onMax,
  token = 'ADI',
  icon,
  disabled,
  style,
}: {
  label?: ReactNode;
  balance?: ReactNode;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onMax?: () => void;
  token?: string;
  /** Token icon shown in the chip. Defaults to a solid accent dot. */
  icon?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
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
        {balance && <span style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>Balance: {balance}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          inputMode="decimal"
          aria-label="Amount to stake"
          placeholder="0.00"
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            font: '700 30px var(--font-condensed)',
            color: value ? 'var(--text-heading)' : 'var(--text-faint)',
          }}
        />
        <button
          type="button"
          onClick={onMax}
          disabled={disabled || !onMax}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            font: 'var(--type-button)',
            color: 'var(--blue-400)',
            cursor: disabled || !onMax ? 'default' : 'pointer',
            opacity: disabled || !onMax ? 0.4 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Max
        </button>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            font: '700 14px var(--font-condensed)',
            color: 'var(--text-heading)',
          }}
        >
          {icon ?? (
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'var(--blue-500)',
                display: 'inline-block',
              }}
            />
          )}
          {token}
        </span>
      </div>
    </div>
  );
}

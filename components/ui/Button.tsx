'use client';

import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

const PAD: Record<ButtonSize, string> = { sm: '8px 16px', md: '12px 24px', lg: '16px 32px' };
const FONT_SIZE: Record<ButtonSize, number> = { sm: 12, md: 14, lg: 15 };

const BG: Record<ButtonVariant, Record<'idle' | 'hover' | 'press', string>> = {
  primary: { idle: 'var(--accent)', hover: 'var(--accent-hover)', press: 'var(--accent-press)' },
  secondary: { idle: 'var(--surface-raised)', hover: 'var(--navy-700)', press: 'var(--navy-600)' },
  ghost: { idle: 'transparent', hover: 'var(--surface-raised)', press: 'var(--navy-700)' },
  danger: { idle: 'var(--negative)', hover: '#F37676', press: '#D14A4A' },
};

const FG: Record<ButtonVariant, string> = {
  primary: 'var(--text-on-accent)',
  secondary: 'var(--text-heading)',
  ghost: 'var(--text-body)',
  danger: '#fff',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [state, setState] = useState<'idle' | 'hover' | 'press'>('idle');
  const inert = disabled || loading;
  const background = BG[variant][inert ? 'idle' : state];

  return (
    <button
      type="button"
      disabled={inert}
      aria-busy={loading || undefined}
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('idle')}
      onMouseDown={() => setState('press')}
      onMouseUp={() => setState('hover')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: PAD[size],
        borderRadius: 'var(--radius-pill)',
        font: `700 ${FONT_SIZE[size]}px var(--font-condensed)`,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: FG[variant],
        background,
        border: variant === 'secondary' ? '1px solid var(--border-strong)' : '1px solid transparent',
        cursor: inert ? 'not-allowed' : 'pointer',
        opacity: inert ? 0.4 : 1,
        transition:
          'background var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
        boxShadow: state === 'hover' && variant === 'primary' && !inert ? 'var(--glow-accent)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            animation: 'adiSpin 700ms linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}

import type { CSSProperties, ReactNode } from 'react';

export type InfoChipTone = 'info' | 'positive' | 'neutral';

const TONES: Record<InfoChipTone, { bg: string; value: string }> = {
  info: { bg: 'var(--info-tint)', value: 'var(--text-heading)' },
  positive: { bg: 'var(--positive-tint)', value: 'var(--positive)' },
  neutral: { bg: 'var(--surface-raised)', value: 'var(--text-heading)' },
};

export function InfoChip({
  label,
  value,
  tone = 'info',
  style,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: InfoChipTone;
  style?: CSSProperties;
}) {
  const colors = TONES[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 'var(--radius-pill)',
        background: colors.bg,
        font: '400 13px var(--font-body)',
        color: 'var(--text-body)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}: <b style={{ font: '700 13px var(--font-condensed)', color: colors.value }}>{value}</b>
    </span>
  );
}

import type { CSSProperties } from 'react';

export function Skeleton({ height = 70, style }: { height?: number; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-raised)',
        animation: 'adiShimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

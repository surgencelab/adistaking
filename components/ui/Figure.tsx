import type { CSSProperties } from 'react';
import type { SplitFigure } from '@/lib/figures';

export type FigureSize = 'sm' | 'md' | 'lg' | 'xl';
export type FigureTone = 'default' | 'positive' | 'muted';

const SIZE: Record<FigureSize, number> = { sm: 15, md: 20, lg: 30, xl: 42 };

const TONE: Record<FigureTone, string> = {
  default: 'var(--text-heading)',
  positive: 'var(--positive)',
  muted: 'var(--text-faint)',
};

/**
 * A number set with its unit subordinated — "12,847" at full contrast, "ADI"
 * stepped back in size, weight, and colour. The unit never competes with the
 * figure, which is what lets the figures carry the page's hierarchy.
 */
export function Figure({
  figure,
  size = 'md',
  tone = 'default',
  style,
}: {
  figure: SplitFigure;
  size?: FigureSize;
  tone?: FigureTone;
  style?: CSSProperties;
}) {
  const px = SIZE[size];
  const unitPx = Math.round(px * (size === 'sm' ? 0.87 : 0.5));

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: figure.unit && figure.unit.length > 1 ? 5 : 1,
        font: `700 ${px}px/1.05 var(--font-condensed)`,
        color: TONE[tone],
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: size === 'xl' ? '-0.015em' : '0',
        ...style,
      }}
    >
      {figure.prefix && <span>{figure.prefix}</span>}
      {figure.value}
      {figure.unit && (
        <span style={{ font: `600 ${unitPx}px var(--font-condensed)`, color: 'var(--text-faint)' }}>
          {figure.unit}
        </span>
      )}
    </span>
  );
}

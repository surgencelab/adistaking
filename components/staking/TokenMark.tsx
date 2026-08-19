'use client';

import { useBrandMark } from '@/lib/hooks/useBrandMark';

/**
 * The token icon used beside an amount.
 *
 * Circular, the convention for token icons — and because the diamond sits well
 * inside the artwork's inscribed circle, cropping to a circle keeps the whole
 * mark and trims only the corners of its background plate. Falls back to a solid
 * accent dot, which is what the design system specified before the asset
 * existed.
 */
export function TokenMark({ size = 18 }: { size?: number }) {
  const src = useBrandMark();

  if (!src) {
    return (
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--blue-500)',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
    />
  );
}

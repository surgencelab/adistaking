'use client';

import { useBrandMark } from '@/lib/hooks/useBrandMark';

/**
 * The corner radius is what makes a mark with its own background plate read as
 * a deliberate app tile rather than a broken cutout. A transparent asset would
 * not need it, but it costs nothing when one arrives.
 *
 * The asset is probed rather than rendered-then-caught, so its absence never
 * flashes a broken-image glyph.
 */
export function Wordmark() {
  const markSrc = useBrandMark();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {markSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={markSrc}
          alt=""
          width={28}
          height={28}
          style={{ display: 'block', flexShrink: 0, borderRadius: 7 }}
        />
      ) : (
        <span
          title="Add the brand mark at public/adi-mark.svg"
          style={{
            width: 28,
            height: 28,
            border: '1px dashed var(--border-strong)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '600 8px var(--font-condensed)',
            color: 'var(--text-faint)',
            flexShrink: 0,
          }}
        >
          LOGO
        </span>
      )}
      <span style={{ font: '800 20px var(--font-display)', color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
        ADI <span style={{ fontWeight: 400 }}>Staking</span>
      </span>
    </div>
  );
}

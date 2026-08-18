'use client';

import { useEffect, useState } from 'react';

/**
 * The brand mark is never redrawn in code — it is loaded from public/.
 * SVG is preferred; a transparent PNG is accepted as a fallback so whichever
 * format is supplied simply works. Until one is present the wordmark stands
 * alone in type.
 *
 * The asset is probed rather than rendered-then-caught, so its absence never
 * flashes a broken-image glyph.
 */
const MARK_CANDIDATES = ['/adi-mark.svg', '/adi-mark.png'];

export function Wordmark() {
  const [markSrc, setMarkSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const probe = (index: number) => {
      if (cancelled || index >= MARK_CANDIDATES.length) return;
      const img = new Image();
      img.onload = () => !cancelled && setMarkSrc(MARK_CANDIDATES[index]);
      img.onerror = () => probe(index + 1);
      img.src = MARK_CANDIDATES[index];
    };

    probe(0);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {markSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={markSrc} alt="" width={28} height={28} style={{ display: 'block', flexShrink: 0 }} />
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

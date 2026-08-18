'use client';

import { useEffect, useState } from 'react';

const MARK_SRC = '/adi-mark.svg';

/**
 * The real mark is an orange/blue diamond. No asset was supplied and the brand
 * rule is never to redraw it — so this renders the wordmark in type with a
 * placeholder slot. Drop the file at public/adi-mark.svg and it appears.
 *
 * The asset is probed rather than rendered-then-caught, so a missing file never
 * flashes a broken-image glyph.
 */
export function Wordmark() {
  const [hasMark, setHasMark] = useState(false);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setHasMark(true);
    probe.src = MARK_SRC;
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {hasMark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={MARK_SRC} alt="" width={28} height={28} style={{ display: 'block' }} />
      ) : (
        <span
          title="Logo asset not provided — drop the SVG at public/adi-mark.svg"
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

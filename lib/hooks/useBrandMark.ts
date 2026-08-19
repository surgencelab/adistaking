'use client';

import { useEffect, useState } from 'react';

/**
 * Resolves the brand mark from public/, preferring SVG.
 *
 * The mark is never redrawn in code, so every surface that shows it loads the
 * same file — swapping in a transparent SVG later updates the nav and the token
 * chip together. The asset is probed rather than rendered-then-caught, so its
 * absence never flashes a broken-image glyph.
 */
const CANDIDATES = ['/adi-mark.svg', '/adi-mark.png'];

export function useBrandMark(): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const probe = (index: number) => {
      if (cancelled || index >= CANDIDATES.length) return;
      const img = new Image();
      img.onload = () => !cancelled && setSrc(CANDIDATES[index]);
      img.onerror = () => probe(index + 1);
      img.src = CANDIDATES[index];
    };

    probe(0);
    return () => {
      cancelled = true;
    };
  }, []);

  return src;
}

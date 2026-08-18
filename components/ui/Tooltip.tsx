'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Info } from 'lucide-react';

export function Tooltip({
  text,
  children,
  style,
}: {
  text: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children ?? (
        <span
          tabIndex={0}
          role="img"
          aria-label={text}
          style={{ color: 'var(--blue-400)', display: 'inline-flex', cursor: 'help' }}
        >
          <Info size={15} strokeWidth={1.75} />
        </span>
      )}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--navy-1000)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            font: 'var(--type-small)',
            color: 'var(--text-body)',
            whiteSpace: 'nowrap',
            zIndex: 50,
            boxShadow: 'var(--shadow-raised)',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

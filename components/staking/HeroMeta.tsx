'use client';

import { ArrowUpRight } from 'lucide-react';
import { STAKING_ADDRESS, TOKEN_SYMBOL } from '@/lib/config';
import { CHAIN_NAME, explorerAddressUrl } from '@/lib/chains';
import { truncateAddress } from '@/lib/format';

const ZERO = '0x0000000000000000000000000000000000000000';

const item: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  font: '500 13px var(--font-body)',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
};

/**
 * Provenance line: which contract, which chain, which asset. Quiet by design —
 * it earns trust by being present and checkable, not by being loud. The contract
 * link only appears once a real address is configured.
 */
export function HeroMeta() {
  const hasContract = STAKING_ADDRESS !== ZERO;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
      {hasContract && (
        <a
          href={explorerAddressUrl(STAKING_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...item, font: 'var(--type-mono)', color: 'var(--text-muted)' }}
        >
          {truncateAddress(STAKING_ADDRESS)}
          <ArrowUpRight size={13} strokeWidth={2} />
        </a>
      )}
      <span style={item}>
        <span
          aria-hidden="true"
          style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--blue-500)', display: 'inline-block' }}
        />
        {CHAIN_NAME}
      </span>
      <span style={item}>
        <span
          aria-hidden="true"
          style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--teal-400)', display: 'inline-block' }}
        />
        {TOKEN_SYMBOL}
      </span>
    </div>
  );
}

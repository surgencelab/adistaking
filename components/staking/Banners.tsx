'use client';

import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui';
import { useWallet } from '@/lib/hooks/useWallet';
import { CHAIN_NAME } from '@/lib/chains';

export function NetworkBanner() {
  const { switchToStakingChain, isSwitching } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        background: 'var(--warning-tint)',
        border: '1px solid var(--warning)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
      }}
    >
      <span
        style={{ font: 'var(--type-small)', color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <AlertTriangle size={15} strokeWidth={1.75} />
        Wrong network — this wallet is on a different chain. Switch to {CHAIN_NAME} to stake.
      </span>
      <Button size="sm" loading={isSwitching} onClick={switchToStakingChain}>
        Switch network
      </Button>
    </div>
  );
}

export function ProgramEndedBanner() {
  return (
    <div
      style={{
        background: 'var(--info-tint)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        font: 'var(--type-small)',
        color: 'var(--blue-300)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <Info size={15} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} />
      The staking program has ended. New positions are closed; open positions continue to accrue until their term
      expires, then become fully claimable.
    </div>
  );
}

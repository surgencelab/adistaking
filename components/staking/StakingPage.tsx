'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { usePositions } from '@/lib/hooks/usePositions';
import { MOCK_MODE } from '@/lib/config';
import { CHAIN_NAME } from '@/lib/chains';
import { Nav } from './Nav';
import { ConnectDialog } from './ConnectDialog';
import { NetworkBanner, ProgramEndedBanner } from './Banners';
import { Hero } from './Hero';
import { StatTiles } from './StatTiles';
import { StakeForm } from './StakeForm';
import { Positions } from './Positions';
import { EmptyPositions } from './EmptyPositions';
import { VolumeChart } from './VolumeChart';
import { PoolComposition } from './PoolComposition';
import { InfoTabs } from './InfoTabs';
import { Footer } from './Footer';
import { DemoBar, type DemoState } from './DemoBar';

/**
 * Three disclosure phases, derived from real state rather than a toggle:
 *   explore — disconnected: pool activity gated behind connect
 *   stake   — connected, no positions: pool basics + per-term APY
 *   manage  — connected with positions: full activity, chart, actions
 */
export function StakingPage() {
  const { address, isConnected, wrongNetwork } = useWallet();
  const { data: positions, isLoading: loadingPositions } = usePositions(address);
  const [connectOpen, setConnectOpen] = useState(false);
  const [demo, setDemo] = useState<DemoState>({ seeded: false, capReached: false, programEnded: false });

  const hasPositions = positions.length > 0;
  const phase = !isConnected ? 'explore' : hasPositions ? 'manage' : 'stake';

  const blocked = wrongNetwork || demo.capReached || demo.programEnded;
  const blockedReason = wrongNetwork
    ? `Switch to ${CHAIN_NAME} to stake.`
    : demo.capReached
      ? 'Pool cap reached — staking is closed for this program.'
      : 'The program has ended — new positions are closed.';

  return (
    <>
      <Nav onConnect={() => setConnectOpen(true)} />

      <main className="adi-shell">
        {wrongNetwork && <NetworkBanner />}
        {demo.programEnded && <ProgramEndedBanner />}

        <Hero locked={phase === 'explore'} positions={positions} capReached={demo.capReached} />

        <StatTiles locked={phase === 'explore'} />

        <div className="adi-main" style={{ alignItems: phase === 'explore' ? 'stretch' : 'start' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              height: phase === 'explore' ? '100%' : 'auto',
            }}
          >
            {phase === 'stake' && !loadingPositions && <EmptyPositions />}
            {phase === 'manage' && <Positions positions={positions} isLoading={loadingPositions} />}
            {phase === 'manage' && <VolumeChart />}
            <PoolComposition
              locked={phase !== 'manage'}
              label={phase === 'stake' ? 'Open a position to unlock pool activity' : 'Connect to view pool activity'}
            />
          </div>

          <StakeForm onConnect={() => setConnectOpen(true)} blocked={blocked} blockedReason={blockedReason} />
        </div>

        <InfoTabs />
      </main>

      <Footer />

      <ConnectDialog open={connectOpen} onClose={() => setConnectOpen(false)} />
      {MOCK_MODE && <DemoBar state={demo} onChange={setDemo} />}
    </>
  );
}

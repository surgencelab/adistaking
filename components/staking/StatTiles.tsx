'use client';

import { Skeleton, StatCard } from '@/components/ui';
import { useProgramStats } from '@/lib/hooks/usePoolData';
import { useNow } from '@/lib/hooks/useNow';
import { formatAdi, formatCountdown, formatUsdCompact } from '@/lib/format';
import { Gated } from './Gated';

export function StatTiles({ locked }: { locked: boolean }) {
  const { data: stats, isLoading } = useProgramStats();
  const now = useNow();

  if (isLoading || !stats || now === 0) {
    return (
      <div className="adi-tiles">
        <Skeleton height={104} />
        <Skeleton height={104} />
        <Skeleton height={104} />
      </div>
    );
  }

  return (
    <Gated locked={locked} label="Connect to view program activity">
      <div className="adi-tiles">
        <StatCard label="Rewards paid" value={formatAdi(stats.rewardsPaid)} caption="Cumulative since program start" />
        <StatCard
          label="Next unlock"
          value={formatCountdown((stats.nextUnlockAt.getTime() - now) / 1000)}
          caption={`${formatAdi(stats.nextUnlockAmount)} unlocks`}
        />
        <StatCard
          label="Total Value Locked (TVL)"
          value={formatUsdCompact(stats.tvlUsd)}
          caption="At current ADI price"
        />
      </div>
    </Gated>
  );
}

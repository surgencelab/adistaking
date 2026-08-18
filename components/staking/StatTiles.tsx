'use client';

import { Figure, Skeleton, StatCard } from '@/components/ui';
import { useProgramStats } from '@/lib/hooks/usePoolData';
import { useNow } from '@/lib/hooks/useNow';
import { adiFigure, countdownFigure, usdFigure } from '@/lib/figures';
import { formatAdi, formatNumber } from '@/lib/format';
import { Gated } from './Gated';

export function StatTiles({ locked }: { locked: boolean }) {
  const { data: stats, isLoading } = useProgramStats();
  const now = useNow();

  if (isLoading || !stats || now === 0) {
    return (
      <div className="adi-tiles">
        <Skeleton height={132} />
        <Skeleton height={132} />
        <Skeleton height={132} />
      </div>
    );
  }

  const secondsToUnlock = (stats.nextUnlockAt.getTime() - now) / 1000;

  return (
    <Gated locked={locked} label="Connect to view program activity">
      <div className="adi-tiles">
        <StatCard
          label="Rewards paid"
          value={<Figure figure={adiFigure(stats.rewardsPaid)} size="xl" />}
          caption="Cumulative since program start"
        />
        <StatCard
          label="Next unlock"
          value={<Figure figure={countdownFigure(secondsToUnlock)} size="xl" />}
          caption={`${formatAdi(stats.nextUnlockAmount)} releases`}
        />
        <StatCard
          label="Total Value Locked (TVL)"
          value={<Figure figure={usdFigure(stats.tvlUsd)} size="xl" />}
          caption={`${formatNumber(stats.tvlAdi, 0)} ADI at the current price`}
        />
      </div>
    </Gated>
  );
}

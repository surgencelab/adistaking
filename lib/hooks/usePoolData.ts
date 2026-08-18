'use client';

import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MOCK_MODE, STAKING_ADDRESS, TOKEN_DECIMALS } from '../config';
import { stakingAbi } from '../contracts';
import { mock } from '../mock';
import type { ActivityEntry, CompositionSlice, PoolState, ProgramStats, VolumePoint } from '../types';
import { qk, settle } from './keys';

const toNum = (v: bigint) => Number(formatUnits(v, TOKEN_DECIMALS));

export function usePool() {
  const live = useReadContract({
    address: STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: 'poolInfo',
    query: { enabled: !MOCK_MODE },
  });

  const mocked = useQuery({
    queryKey: qk.pool,
    queryFn: () => settle(mock.pool()),
    enabled: MOCK_MODE,
    refetchInterval: 30_000,
  });

  if (MOCK_MODE) return { data: mocked.data, isLoading: mocked.isPending };

  const raw = live.data;
  const data: PoolState | undefined = raw && {
    staked: toNum(raw[0]),
    cap: toNum(raw[1]),
    baseApyPct: Number(raw[2]) / 100,
    programStart: new Date(Number(raw[3]) * 1000),
    programEnd: new Date(Number(raw[4]) * 1000),
    stakers: Number(raw[5]),
    avgLockDays: Math.round(Number(raw[6]) / 86_400),
  };
  return { data, isLoading: live.isPending };
}

export function useProgramStats() {
  const live = useReadContract({
    address: STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: 'programStats',
    query: { enabled: !MOCK_MODE },
  });

  const mocked = useQuery({
    queryKey: qk.stats,
    queryFn: () => settle(mock.stats()),
    enabled: MOCK_MODE,
    refetchInterval: 30_000,
  });

  if (MOCK_MODE) return { data: mocked.data, isLoading: mocked.isPending };

  const raw = live.data;
  const data: ProgramStats | undefined = raw && {
    rewardsPaid: toNum(raw[0]),
    nextUnlockAt: new Date(Number(raw[1]) * 1000),
    nextUnlockAmount: toNum(raw[2]),
    // No price oracle in the staking contract — wire a price feed here.
    tvlUsd: 0,
  };
  return { data, isLoading: live.isPending };
}

export function useComposition() {
  const live = useReadContract({
    address: STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: 'compositionOf',
    query: { enabled: !MOCK_MODE },
  });

  const mocked = useQuery({
    queryKey: qk.composition,
    queryFn: () => settle(mock.composition()),
    enabled: MOCK_MODE,
  });

  if (MOCK_MODE) return { data: mocked.data, isLoading: mocked.isPending };

  const raw = live.data;
  const data: CompositionSlice[] | undefined =
    raw &&
    raw[0].map((days, i) => ({
      termDays: Number(days) as CompositionSlice['termDays'],
      pct: Number(raw[1][i]) / 100,
    }));
  return { data, isLoading: live.isPending };
}

/** Recent stakes across the pool. No contract read covers this — it needs an
 *  indexer (subgraph or Dune). Mock until that exists. */
export function useActivity() {
  const mocked = useQuery({
    queryKey: qk.activity,
    queryFn: () => settle(mock.activity()),
    refetchInterval: 60_000,
  });
  return { data: mocked.data as ActivityEntry[] | undefined, isLoading: mocked.isPending };
}

/** Program volume time series — indexer-backed, same as activity. */
export function useVolume() {
  const mocked = useQuery({
    queryKey: qk.volume,
    queryFn: () => settle(mock.volume()),
  });
  return { data: mocked.data as VolumePoint[] | undefined, isLoading: mocked.isPending };
}

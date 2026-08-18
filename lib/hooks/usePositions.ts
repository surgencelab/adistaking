'use client';

import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MOCK_MODE, STAKING_ADDRESS, TOKEN_DECIMALS } from '../config';
import { stakingAbi } from '../contracts';
import { mock } from '../mock';
import type { LockTermDays, Position } from '../types';
import { qk, settle } from './keys';
import { useNow } from './useNow';

export function usePositions(address?: `0x${string}`) {
  const now = useNow();
  const live = useReadContract({
    address: STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: 'positionsOf',
    args: address ? [address] : undefined,
    query: { enabled: !MOCK_MODE && !!address },
  });

  const mocked = useQuery({
    queryKey: qk.positions(address),
    queryFn: () => settle(mock.positions()),
    enabled: MOCK_MODE && !!address,
    // Keep progress bars and maturity flags moving.
    refetchInterval: 30_000,
  });

  if (MOCK_MODE) {
    return {
      data: address ? (mocked.data ?? []) : [],
      isLoading: !!address && mocked.isPending,
    };
  }

  const data: Position[] = (live.data ?? []).map((p) => {
    const openedAt = new Date(Number(p.openedAt) * 1000);
    const maturesAt = new Date(Number(p.maturesAt) * 1000);
    const total = maturesAt.getTime() - openedAt.getTime();
    return {
      id: Number(p.id),
      amount: Number(formatUnits(p.amount, TOKEN_DECIMALS)),
      rewards: Number(formatUnits(p.rewards, TOKEN_DECIMALS)),
      termDays: Number(p.termDays) as LockTermDays,
      multiplier: Number(p.multiplierBps) / 10_000,
      openedAt,
      maturesAt,
      progressPct: Math.min(100, Math.max(0, ((now - openedAt.getTime()) / total) * 100)),
      matured: now >= maturesAt.getTime(),
    };
  });

  return { data, isLoading: !!address && live.isPending };
}

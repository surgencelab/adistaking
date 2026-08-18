'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConnection, useWriteContractSync } from 'wagmi';
import { parseUnits } from 'viem';
import { MOCK_MODE, STAKING_ADDRESS, TOKEN_ADDRESS, TOKEN_DECIMALS } from '../config';
import { erc20Abi, stakingAbi } from '../contracts';
import { mock } from '../mock';
import type { LockTermDays } from '../types';

export type ActionKind = 'approve' | 'stake' | 'claim' | 'unstake' | 'restake';

/** How long the mock branch pretends a wallet confirmation takes. */
const MOCK_TX_MS = 1_500;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Every state-changing call the page makes. In mock mode each one resolves
 * against the in-memory store after a simulated wallet round-trip; in live mode
 * each one submits a transaction and waits for its receipt. The signatures are
 * identical, so components never branch.
 */
export function useStakeActions() {
  const { address } = useConnection();
  const queryClient = useQueryClient();
  const { mutateAsync: writeAsync } = useWriteContractSync();
  const [pending, setPending] = useState<ActionKind | null>(null);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['adi'] });
  }, [queryClient]);

  const run = useCallback(
    async (kind: ActionKind, live: () => Promise<unknown>, simulate: () => void) => {
      setPending(kind);
      try {
        if (MOCK_MODE) {
          await wait(MOCK_TX_MS);
          simulate();
        } else {
          await live();
        }
        refresh();
      } finally {
        setPending(null);
      }
    },
    [refresh],
  );

  const approve = useCallback(
    (amount: number) =>
      run(
        'approve',
        () =>
          writeAsync({
            address: TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'approve',
            args: [STAKING_ADDRESS, parseUnits(String(amount), TOKEN_DECIMALS)],
          }),
        () => mock.approve(),
      ),
    [run, writeAsync],
  );

  const stake = useCallback(
    (amount: number, termDays: LockTermDays) =>
      run(
        'stake',
        () =>
          writeAsync({
            address: STAKING_ADDRESS,
            abi: stakingAbi,
            functionName: 'stake',
            args: [parseUnits(String(amount), TOKEN_DECIMALS), termDays],
          }),
        () => mock.stake(amount, termDays),
      ),
    [run, writeAsync],
  );

  const claim = useCallback(
    (ids: number[]) =>
      run(
        'claim',
        () =>
          writeAsync({
            address: STAKING_ADDRESS,
            abi: stakingAbi,
            functionName: 'claim',
            args: [ids.map(BigInt)],
          }),
        () => mock.claim(ids),
      ),
    [run, writeAsync],
  );

  const unstake = useCallback(
    (ids: number[]) =>
      run(
        'unstake',
        () =>
          writeAsync({
            address: STAKING_ADDRESS,
            abi: stakingAbi,
            functionName: 'unstake',
            args: [ids.map(BigInt)],
          }),
        () => mock.unstake(ids),
      ),
    [run, writeAsync],
  );

  const restake = useCallback(
    (ids: number[], termDays: LockTermDays) =>
      run(
        'restake',
        () =>
          writeAsync({
            address: STAKING_ADDRESS,
            abi: stakingAbi,
            functionName: 'restake',
            args: [ids.map(BigInt), termDays],
          }),
        () => mock.restake(ids, termDays),
      ),
    [run, writeAsync],
  );

  return { address, pending, approve, stake, claim, unstake, restake };
}

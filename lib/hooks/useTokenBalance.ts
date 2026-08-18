'use client';

import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MOCK_MODE, STAKING_ADDRESS, TOKEN_ADDRESS, TOKEN_DECIMALS } from '../config';
import { erc20Abi } from '../contracts';
import { mock } from '../mock';
import { qk, settle } from './keys';

export function useTokenBalance(address?: `0x${string}`) {
  const live = useReadContract({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !MOCK_MODE && !!address },
  });

  const mocked = useQuery({
    queryKey: qk.balance(address),
    queryFn: () => settle(mock.balance(), 250),
    enabled: MOCK_MODE && !!address,
  });

  if (MOCK_MODE) return { data: address ? mocked.data : undefined, isLoading: !!address && mocked.isPending };

  return {
    data: live.data !== undefined ? Number(formatUnits(live.data, TOKEN_DECIMALS)) : undefined,
    isLoading: !!address && live.isPending,
  };
}

/** How much ADI the staking contract is already approved to move. */
export function useAllowance(address?: `0x${string}`) {
  const live = useReadContract({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, STAKING_ADDRESS] : undefined,
    query: { enabled: !MOCK_MODE && !!address },
  });

  if (MOCK_MODE) return { data: mock.allowance() };

  return {
    data: live.data !== undefined ? Number(formatUnits(live.data, TOKEN_DECIMALS)) : 0,
  };
}

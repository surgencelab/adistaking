/**
 * Contract interfaces.
 *
 * The staking ABI below is the specification of the contract surface this page
 * depends on:
 *
 *   reads   poolInfo, positionsOf, programStats, compositionOf
 *   writes  stake, claim, unstake, restake
 *
 * Reconcile it against the deployed ABI before going live. If the contract
 * names things differently, change the names here and in lib/hooks — no
 * component references an ABI directly, so the blast radius stays in this file.
 */

export const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
] as const;

export const stakingAbi = [
  {
    type: 'function',
    name: 'poolInfo',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalStaked', type: 'uint256' },
      { name: 'cap', type: 'uint256' },
      { name: 'baseApyBps', type: 'uint256' },
      { name: 'programStart', type: 'uint64' },
      { name: 'programEnd', type: 'uint64' },
      { name: 'stakerCount', type: 'uint256' },
      { name: 'avgLockSeconds', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'programStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'rewardsPaid', type: 'uint256' },
      { name: 'nextUnlockAt', type: 'uint64' },
      { name: 'nextUnlockAmount', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'compositionOf',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'termDays', type: 'uint32[]' },
      { name: 'bps', type: 'uint32[]' },
    ],
  },
  {
    type: 'function',
    name: 'positionsOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      {
        name: 'positions',
        type: 'tuple[]',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'rewards', type: 'uint256' },
          { name: 'termDays', type: 'uint32' },
          { name: 'multiplierBps', type: 'uint32' },
          { name: 'openedAt', type: 'uint64' },
          { name: 'maturesAt', type: 'uint64' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'stake',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'termDays', type: 'uint32' },
    ],
    outputs: [{ name: 'positionId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'positionIds', type: 'uint256[]' }],
    outputs: [{ name: 'claimed', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'unstake',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'positionIds', type: 'uint256[]' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'restake',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'positionIds', type: 'uint256[]' },
      { name: 'termDays', type: 'uint32' },
    ],
    outputs: [],
  },
] as const;

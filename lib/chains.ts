import { defineChain } from 'viem';

/**
 * ADI Chain.
 *
 * PLACEHOLDER — no chain id, RPC, or explorer was supplied with the design
 * handoff. Everything below is env-driven so this is a one-file swap:
 *
 *   NEXT_PUBLIC_CHAIN_ID
 *   NEXT_PUBLIC_CHAIN_NAME
 *   NEXT_PUBLIC_RPC_URL
 *   NEXT_PUBLIC_EXPLORER_URL
 *
 * The default falls back to Ethereum mainnet (1) so wallet connection, network
 * detection, and the "switch network" flow are genuinely exercisable today
 * rather than permanently stuck on a wrong-network banner. Replace the env
 * values with ADI Chain's real ones before shipping.
 */
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);
export const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME ?? 'ADI Chain';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? 'https://eth.llamarpc.com';
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://etherscan.io';

/** True while the chain is still the mainnet stand-in rather than ADI Chain. */
export const CHAIN_IS_PLACEHOLDER = !process.env.NEXT_PUBLIC_CHAIN_ID;

export const adiChain = defineChain({
  id: CHAIN_ID,
  name: CHAIN_NAME,
  nativeCurrency: { name: 'ADI', symbol: 'ADI', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: 'Explorer', url: EXPLORER_URL } },
});

export const explorerAddressUrl = (address: string) => `${EXPLORER_URL}/address/${address}`;
export const explorerTxUrl = (hash: string) => `${EXPLORER_URL}/tx/${hash}`;

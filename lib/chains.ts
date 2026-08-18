import { defineChain } from 'viem';

/**
 * ADI Chain.
 *
 * Fully environment-driven, so pointing the app at the network is a config
 * change rather than a code change:
 *
 *   NEXT_PUBLIC_CHAIN_ID
 *   NEXT_PUBLIC_CHAIN_NAME
 *   NEXT_PUBLIC_RPC_URL
 *   NEXT_PUBLIC_EXPLORER_URL
 *
 * Unset, these fall back to Ethereum mainnet so wallet connection, network
 * detection, and the switch-network flow stay exercisable in local development
 * instead of sitting permanently on a wrong-network banner.
 */
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);
export const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME ?? 'ADI Chain';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? 'https://eth.llamarpc.com';
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://etherscan.io';

/** True while the chain is still the development fallback rather than ADI Chain. */
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

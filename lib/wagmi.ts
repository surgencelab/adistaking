import { createConfig, http } from 'wagmi';
import { coinbaseWallet, injected, mock, walletConnect } from 'wagmi/connectors';
import { adiChain, CHAIN_ID, RPC_URL } from './chains';
import { MOCK_MODE, WALLETCONNECT_PROJECT_ID } from './config';

/** Address used by the demo connector — matches the handoff screenshots. */
export const DEMO_ADDRESS = '0x9A4f2C81b7d14E09Af33517Cc2Ba55e0d19FB221' as const;

/**
 * Injected wallets (MetaMask, Rabby, Trust, …) are discovered automatically via
 * EIP-6963, so the connect dialog lists whatever the visitor actually has.
 * WalletConnect only registers when a project id is configured.
 *
 * While MOCK_MODE is on, a demo connector is offered too, so the connected and
 * staked phases are reviewable without a wallet or a deployed contract. It
 * disappears the moment real contract addresses are configured.
 */
const connectors = [
  injected(),
  coinbaseWallet({ appName: 'ADI Staking' }),
  ...(WALLETCONNECT_PROJECT_ID
    ? [walletConnect({ projectId: WALLETCONNECT_PROJECT_ID, showQrModal: true })]
    : []),
  ...(MOCK_MODE ? [mock({ accounts: [DEMO_ADDRESS], features: { reconnect: true } })] : []),
];

export const wagmiConfig = createConfig({
  chains: [adiChain],
  connectors,
  transports: { [CHAIN_ID]: http(RPC_URL) },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

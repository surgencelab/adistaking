'use client';

import { useConnection, useDisconnect, useSwitchChain } from 'wagmi';
import { CHAIN_ID, CHAIN_NAME } from '../chains';

/** Connection state plus the one derived flag the page cares about: whether the
 *  wallet is pointed at the staking chain. */
export function useWallet() {
  const connection = useConnection();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isConnected = connection.status === 'connected';
  const wrongNetwork = isConnected && connection.chainId !== CHAIN_ID;

  return {
    address: connection.address,
    chainId: connection.chainId,
    connectorName: connection.connector?.name,
    isConnected,
    isReconnecting: connection.status === 'reconnecting',
    wrongNetwork,
    chainName: CHAIN_NAME,
    isSwitching,
    switchToStakingChain: () => switchChain({ chainId: CHAIN_ID }),
    disconnect,
  };
}

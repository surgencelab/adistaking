'use client';

import type { ReactNode } from 'react';
import { Web3Provider } from './Web3Provider';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web3Provider>
      <ToastProvider>{children}</ToastProvider>
    </Web3Provider>
  );
}

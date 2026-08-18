'use client';

import { useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { getServerTheme, getTheme, setTheme, subscribeTheme } from '@/lib/theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme]);
  return { theme, toggle };
}

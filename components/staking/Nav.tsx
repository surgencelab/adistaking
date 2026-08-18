'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { useWallet } from '@/lib/hooks/useWallet';
import { explorerAddressUrl } from '@/lib/chains';
import { truncateAddress } from '@/lib/format';
import { Wordmark } from './Wordmark';

export function Nav({ onConnect }: { onConnect: () => void }) {
  const { address, isConnected, wrongNetwork, chainName, disconnect } = useWallet();
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickAway = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [menuOpen]);

  const items: { label: string; danger?: boolean; run: () => void }[] = [
    {
      label: 'Copy address',
      run: async () => {
        if (!address) return;
        try {
          await navigator.clipboard.writeText(address);
          toast('Address copied.', 'info');
        } catch {
          toast('Could not copy — clipboard is unavailable.', 'negative');
        }
      },
    },
    {
      label: 'View on explorer',
      run: () => address && window.open(explorerAddressUrl(address), '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'Disconnect',
      danger: true,
      run: () => {
        disconnect();
        toast('Wallet disconnected.', 'info');
      },
    },
  ];

  return (
    <nav
      className="adi-nav"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '18px 40px',
        background: 'var(--surface-inset)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <Wordmark />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={14} strokeWidth={2} /> : <Sun size={14} strokeWidth={2} />}
          {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
        {isConnected ? (
          <>
            <Badge tone={wrongNetwork ? 'warning' : 'positive'}>{wrongNetwork ? 'Wrong network' : chainName}</Badge>
            <div style={{ position: 'relative' }} ref={menuRef}>
              <Button
                variant="secondary"
                size="sm"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                // Addresses are checksummed — uppercasing them would corrupt the casing.
                style={{ textTransform: 'none', letterSpacing: '0.02em' }}
              >
                {truncateAddress(address)}
                <ChevronDown size={13} strokeWidth={2} />
              </Button>
              {menuOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-raised)',
                    padding: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 190,
                    zIndex: 80,
                  }}
                >
                  {items.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        item.run();
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--navy-700)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      style={{
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px',
                        font: '600 13px var(--font-body)',
                        color: item.danger ? 'var(--negative)' : 'var(--text-heading)',
                        cursor: 'pointer',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Button onClick={onConnect}>Connect wallet</Button>
        )}
      </div>
    </nav>
  );
}

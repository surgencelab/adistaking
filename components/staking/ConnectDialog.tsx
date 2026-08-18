'use client';

import { useConnect } from 'wagmi';
import { Dialog } from '@/components/ui';
import { useToast } from '@/components/providers/ToastProvider';
import { CHAIN_NAME } from '@/lib/chains';

export function ConnectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { connectors, connect, isPending } = useConnect();
  const toast = useToast();

  // EIP-6963 discovery can surface the same wallet twice — dedupe by name.
  const seen = new Set<string>();
  const wallets = connectors.filter((c) => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  const displayName = (name: string, type: string) => (type === 'mock' ? 'Demo wallet' : name);

  return (
    <Dialog open={open} title="Connect wallet" onClose={onClose}>
      <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0 }}>
        Connect an EVM wallet configured for {CHAIN_NAME}. By connecting you accept the Terms &amp; Conditions.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {wallets.map((connector) => (
          <button
            key={connector.uid}
            type="button"
            disabled={isPending}
            onClick={() =>
              connect(
                { connector },
                {
                  onSuccess: () => {
                    onClose();
                    toast(`Connected with ${connector.name}.`, 'positive', 'Wallet connected');
                  },
                  onError: (error) => toast(error.message, 'negative', 'Connection failed'),
                },
              )
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: isPending ? 'wait' : 'pointer',
              color: 'var(--text-heading)',
              font: '600 15px var(--font-body)',
              textAlign: 'left',
            }}
          >
            {connector.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={connector.icon} alt="" width={24} height={24} style={{ borderRadius: 6 }} />
            ) : (
              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: '1px dashed var(--border-strong)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: '600 9px var(--font-condensed)',
                  color: 'var(--text-faint)',
                  flexShrink: 0,
                }}
              >
                {displayName(connector.name, connector.type).slice(0, 1)}
              </span>
            )}
            {displayName(connector.name, connector.type)}
          </button>
        ))}
        {wallets.length === 0 && (
          <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0 }}>
            No wallet detected. Install an EVM wallet extension to continue.
          </p>
        )}
      </div>
    </Dialog>
  );
}

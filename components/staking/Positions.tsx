'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button, Card, Checkbox, Dialog, Figure, ProgressBar, Skeleton } from '@/components/ui';
import { useToast } from '@/components/providers/ToastProvider';
import { useStakeActions } from '@/lib/hooks/useStakeActions';
import { DEFAULT_TERM_DAYS } from '@/lib/config';
import { formatDateShort, formatNumber } from '@/lib/format';
import { adiFigure } from '@/lib/figures';
import type { LockTermDays, Position } from '@/lib/types';

type Action = 'claim' | 'restake' | 'unstake';

const COPY: Record<Action, { title: string; body: string }> = {
  claim: {
    title: 'Claim rewards',
    body: 'Claim accrued rewards for the selected positions? Claimed rewards are transferred to your wallet.',
  },
  restake: {
    title: 'Restake position',
    body: 'Restake the matured principal into a new lock term? The new position starts immediately.',
  },
  unstake: {
    title: 'Unstake position',
    body: 'Unstake the selected matured positions? Principal and any remaining rewards are returned to your wallet. This cannot be undone.',
  },
};

const COLUMNS = '1fr 0.6fr 0.7fr 1.1fr 1.4fr 1fr 40px';

function ActionsMenu({
  disabled,
  maturedOnly,
  onPick,
}: {
  disabled: boolean;
  maturedOnly: boolean;
  onPick: (action: Action) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);

  const items: { key: Action; label: string; enabled: boolean }[] = [
    { key: 'claim', label: 'Claim rewards', enabled: true },
    { key: 'restake', label: 'Restake', enabled: maturedOnly },
    { key: 'unstake', label: 'Unstake', enabled: maturedOnly },
  ];

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <Button size="sm" disabled={disabled} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Actions <ChevronDown size={13} strokeWidth={2} />
      </Button>
      {open && (
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
            zIndex: 60,
          }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={!item.enabled}
              onClick={() => {
                setOpen(false);
                onPick(item.key);
              }}
              onMouseEnter={(e) => {
                if (item.enabled) e.currentTarget.style.background = 'var(--navy-700)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              style={{
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                font: '600 13px var(--font-body)',
                color: item.enabled ? 'var(--text-heading)' : 'var(--text-faint)',
                cursor: item.enabled ? 'pointer' : 'not-allowed',
              }}
            >
              {item.label}
              {!item.enabled && (
                <span style={{ font: '400 11px var(--font-body)', color: 'var(--text-faint)' }}> · at maturity</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Positions({ positions, isLoading }: { positions: Position[]; isLoading: boolean }) {
  const toast = useToast();
  const { claim, restake, unstake, pending } = useStakeActions();
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [confirm, setConfirm] = useState<Action | null>(null);

  const selectedRows = useMemo(() => positions.filter((p) => selected[p.id]), [positions, selected]);
  const rewardSum = selectedRows.reduce((sum, p) => sum + p.rewards, 0);
  const maturedOnly = selectedRows.length > 0 && selectedRows.every((p) => p.matured);
  const busy = pending === 'claim' || pending === 'restake' || pending === 'unstake';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={54} />
        <Skeleton height={54} />
        <Skeleton height={54} />
      </div>
    );
  }

  const run = async (action: Action) => {
    const ids = selectedRows.map((p) => p.id);
    try {
      if (action === 'claim') {
        await claim(ids);
        toast(`Rewards claimed for ${ids.length} position${ids.length > 1 ? 's' : ''}.`, 'positive', 'Rewards claimed');
      } else if (action === 'restake') {
        await restake(ids, DEFAULT_TERM_DAYS as LockTermDays);
        toast('Matured principal restaked into a new term.', 'positive', 'Restaked');
      } else {
        await unstake(ids);
        toast('Principal returned to your wallet.', 'positive', 'Unstaked');
      }
      setSelected({});
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Transaction failed.', 'negative', 'Transaction failed');
    } finally {
      setConfirm(null);
    }
  };

  const th = { font: 'var(--type-small)', color: 'var(--text-muted)', textAlign: 'left' as const };

  return (
    <Card
      title="Staking positions"
      actions={
        <>
          <span style={{ font: 'var(--type-small)', color: rewardSum ? 'var(--text-body)' : 'var(--text-faint)' }}>
            {selectedRows.length ? `${selectedRows.length} selected · Rewards ` : 'Select positions · '}
            <b
              style={{
                color: rewardSum ? 'var(--positive)' : 'var(--text-faint)',
                font: '700 13px var(--font-condensed)',
              }}
            >
              {formatNumber(rewardSum, 1)} ADI
            </b>
          </span>
          <ActionsMenu disabled={!selectedRows.length || busy} maturedOnly={maturedOnly} onPick={setConfirm} />
        </>
      }
    >
      <div className="adi-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: COLUMNS, gap: 12, padding: '0 16px', minWidth: 680 }}>
          {['Staked', 'Boost', 'Opened', 'Rewards Accumulated', 'Staking Duration', 'End Date', ''].map((h, i) => (
            <span key={i} style={th}>
              {h}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {positions.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: COLUMNS,
                gap: 12,
                alignItems: 'center',
                background: 'var(--surface-row)',
                border: `1px solid ${selected[p.id] ? 'var(--border-strong)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                padding: '13px 16px',
                minWidth: 680,
                transition: 'border-color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)',
              }}
              onMouseEnter={(e) => {
                if (!selected[p.id]) e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              onMouseLeave={(e) => {
                if (!selected[p.id]) e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <Figure figure={adiFigure(p.amount)} size="sm" />
              <span style={{ font: 'var(--type-small)', color: 'var(--text-body)' }}>{p.multiplier.toFixed(2)}x</span>
              <span style={{ font: 'var(--type-small)', color: 'var(--text-body)' }}>{formatDateShort(p.openedAt)}</span>
              <Figure figure={adiFigure(p.rewards, 1)} size="sm" tone={p.rewards ? 'positive' : 'muted'} />
              <ProgressBar value={p.progressPct} height={6} label={`${p.termDays}-day lock progress`} />
              <span style={{ font: 'var(--type-small)', color: p.matured ? 'var(--positive)' : 'var(--text-body)' }}>
                {p.matured ? 'Matured' : formatDateShort(p.maturesAt)}
              </span>
              <Checkbox
                checked={!!selected[p.id]}
                ariaLabel={`Select position ${p.id}`}
                onChange={(v) => setSelected((s) => ({ ...s, [p.id]: v }))}
              />
            </div>
          ))}
          {!positions.length && (
            <div style={{ font: 'var(--type-small)', color: 'var(--text-muted)', padding: '18px 16px' }}>
              All positions closed. Open a new one with the stake form.
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!confirm} title={confirm ? COPY[confirm].title : ''} onClose={() => setConfirm(null)}>
        <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0 }}>
          {confirm ? COPY[confirm].body : ''}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} onClick={() => confirm && run(confirm)}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </Card>
  );
}

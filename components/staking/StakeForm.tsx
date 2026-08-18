'use client';

import { useMemo, useState } from 'react';
import { AmountInput, Button, DurationSelector, Tooltip } from '@/components/ui';
import { useToast } from '@/components/providers/ToastProvider';
import { useWallet } from '@/lib/hooks/useWallet';
import { useAllowance, useTokenBalance } from '@/lib/hooks/useTokenBalance';
import { usePool } from '@/lib/hooks/usePoolData';
import { useStakeActions } from '@/lib/hooks/useStakeActions';
import { useNow } from '@/lib/hooks/useNow';
import { DEFAULT_TERM_DAYS, EST_NETWORK_FEE, LOCK_TERMS, MIN_STAKE, TOKEN_SYMBOL } from '@/lib/config';
import { formatAdi, formatAdiAuto, formatDateShort, formatNumber, parseAmount } from '@/lib/format';
import type { LockTermDays } from '@/lib/types';

const DAY_MS = 86_400_000;

export function StakeForm({
  onConnect,
  blocked,
  blockedReason,
}: {
  onConnect: () => void;
  blocked: boolean;
  blockedReason?: string;
}) {
  const { address, isConnected } = useWallet();
  const toast = useToast();
  const { data: pool } = usePool();
  const { data: balance } = useTokenBalance(address);
  const { data: allowance } = useAllowance(address);
  const { pending, approve, stake } = useStakeActions();
  const now = useNow();

  const [value, setValue] = useState('');
  const [termDays, setTermDays] = useState<LockTermDays>(DEFAULT_TERM_DAYS as LockTermDays);

  const amount = parseAmount(value);
  const term = LOCK_TERMS.find((t) => t.days === termDays) ?? LOCK_TERMS[0];
  const baseApy = pool?.baseApyPct ?? 0;

  const insufficient = isConnected && balance !== undefined && amount > balance;
  const needsApproval = amount > (allowance ?? 0);
  const busy = pending === 'approve' || pending === 'stake';

  const { apy, estRewards, endDate } = useMemo(() => {
    const apyPct = baseApy * term.multiplier;
    return {
      apy: apyPct,
      estRewards: amount > 0 ? (amount * apyPct * termDays) / (100 * 365) : null,
      // now is 0 until the shared clock's first tick — show a dash rather than 1970.
      endDate: now ? new Date(now + termDays * DAY_MS) : null,
    };
  }, [amount, baseApy, now, term.multiplier, termDays]);

  const submit = async () => {
    if (!isConnected) {
      onConnect();
      return;
    }
    if (blocked) return;
    if (!value) {
      toast('Enter an amount to stake.', 'warning');
      return;
    }
    if (amount < MIN_STAKE) {
      toast(`Minimum stake is ${formatAdi(MIN_STAKE)}.`, 'warning');
      return;
    }
    if (insufficient) return;

    try {
      if (needsApproval) {
        toast('Confirm the approval in your wallet.', 'info');
        await approve(amount);
        toast(`${TOKEN_SYMBOL} approved. Step 2 of 2: confirm the stake.`, 'info', 'Approval confirmed');
        return;
      }
      toast('Confirm the staking transaction in your wallet.', 'info');
      await stake(amount, termDays);
      toast(
        `${formatAdi(amount)} locked for ${termDays} days. Principal and rewards release at maturity.`,
        'positive',
        'Stake confirmed',
      );
      setValue('');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Transaction failed.', 'negative', 'Transaction failed');
    }
  };

  const label = !isConnected
    ? 'Connect wallet'
    : busy
      ? 'Confirm in wallet…'
      : needsApproval
        ? `Approve ${TOKEN_SYMBOL}`
        : `Stake ${TOKEN_SYMBOL}`;

  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: '9px 0',
    font: 'var(--type-small)',
  } as const;

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'sticky',
        top: 20,
      }}
    >
      <AmountInput
        balance={isConnected && balance !== undefined ? formatAdiAuto(balance) : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/[^0-9.,]/g, ''))}
        onMax={isConnected && balance !== undefined ? () => setValue(String(balance)) : undefined}
        disabled={busy}
      />

      {insufficient && (
        <div style={{ font: 'var(--type-small)', color: 'var(--negative)', marginTop: -8 }}>
          Insufficient balance — you hold {formatAdiAuto(balance ?? 0)}.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>
          Minimum stake: {formatAdi(MIN_STAKE)}
        </span>
        <span style={{ font: 'var(--type-small)', color: 'var(--text-faint)' }}>Est. network fee {EST_NETWORK_FEE}</span>
      </div>

      <div
        style={{
          background: 'var(--surface-raised)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <span
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'inline-flex',
            gap: 6,
            alignItems: 'center',
          }}
        >
          Staking lock duration <Tooltip text="Longer locks earn boosted reward multipliers." />
        </span>
        <DurationSelector
          value={termDays}
          onChange={setTermDays}
          disabled={busy}
          options={LOCK_TERMS.map((t) => ({
            value: t.days,
            label: `${t.days} days`,
            sub: `${t.multiplier.toFixed(2)}x Multiplier`,
          }))}
        />
      </div>

      <div>
        <div style={row}>
          <span style={{ color: 'var(--text-muted)' }}>Staking end date</span>
          <b style={{ color: 'var(--text-heading)' }}>{endDate ? formatDateShort(endDate) : '—'}</b>
        </div>
        <div style={{ ...row, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Predicted APY</span>
          <b style={{ color: 'var(--text-heading)' }}>~{apy.toFixed(2)}%</b>
        </div>
        <div style={{ ...row, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Est. rewards</span>
          <b style={{ color: estRewards ? 'var(--positive)' : 'var(--text-heading)' }}>
            {estRewards ? `${formatNumber(estRewards, 1)} ${TOKEN_SYMBOL}` : `— ${TOKEN_SYMBOL}`}
          </b>
        </div>
      </div>

      <Button size="lg" loading={busy} onClick={submit} disabled={isConnected && (blocked || insufficient)}>
        {label}
      </Button>

      {isConnected && blocked && (
        <div
          style={{
            background: 'var(--warning-tint)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            font: 'var(--type-small)',
            color: 'var(--warning)',
          }}
        >
          {blockedReason}
        </div>
      )}

      {isConnected && !blocked && (
        <div
          style={{
            background: 'var(--surface-inset)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            font: 'var(--type-small)',
            color: 'var(--text-muted)',
          }}
        >
          {needsApproval
            ? `Step 1 of 2: confirm ${TOKEN_SYMBOL} approval in your wallet.`
            : 'Step 2 of 2: confirm the staking transaction.'}
        </div>
      )}
    </div>
  );
}

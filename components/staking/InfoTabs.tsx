'use client';

import { useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, Tabs } from '@/components/ui';
import { LINKS } from '@/lib/config';

const FAQS: [string, string][] = [
  [
    'What happens to my ADI after I stake?',
    'Staked ADI is transferred to the staking contract and locked for the selected term. Your position is recorded onchain against your wallet address. Principal is returned at maturity, at which point accrued rewards also become claimable.',
  ],
  [
    'Is the APY fixed or variable?',
    'Variable. Rewards are distributed from a fixed program allocation on a set emission schedule. As pool participation grows, staked position yield will adjust accordingly.',
  ],
  [
    'How do lock multipliers work?',
    "Each lock term applies a weighting to a position's share of the reward pool. Longer terms receive proportionally higher weighting. The multiplier is fixed at stake time and applies for the full duration of the lock.",
  ],
  [
    'Can I unstake early?',
    'No. Positions are non-withdrawable until the selected lock term ends. Principal is released at maturity, at which point accrued rewards also become claimable.',
  ],
  [
    'What happens at program end?',
    "New emissions stop at the program's scheduled end date. Open positions continue to accrue at the rate set at stake time until their term expires, then become fully claimable. No action is required from stakers during the wind-down.",
  ],
  [
    'Which network and wallets?',
    'Staking operates natively for ERC-20 $ADI. Any EVM-compatible wallet configured for the network can interact with the contract, including MetaMask, Rabby, Trust Wallet, and hardware wallets connected via WalletConnect.',
  ],
];

const STEPS: [string, ReactNode][] = [
  [
    '01 Connect wallet',
    <>
      Connect an EVM wallet holding ERC-20 $ADI. Asset cross-chain transfers are supported via the{' '}
      <a
        href={LINKS.bridge}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
      >
        ADI Bridge <ArrowUpRight size={12} strokeWidth={2} />
      </a>
      .
    </>,
  ],
  ['02 Choose amount and term', 'Set the amount to stake and select a lock term.'],
  ['03 Approve and stake', 'Approve the staking contract, then confirm to open the position.'],
  [
    '04 Track your position',
    'Monitor accrual in the dashboard. Principal and rewards become claimable at term end.',
  ],
];

export function InfoTabs() {
  const [tab, setTab] = useState<'faq' | 'how'>('faq');

  return (
    <Card>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'faq', label: 'FAQ' },
          { value: 'how', label: 'How it works' },
        ]}
      />

      {tab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map(([question, answer]) => (
            <div key={question} style={{ background: 'var(--surface-row)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
              <div style={{ font: '600 14px var(--font-body)', color: 'var(--text-heading)', marginBottom: 4 }}>
                {question}
              </div>
              <div style={{ font: 'var(--type-small)', color: 'var(--text-muted)' }}>{answer}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'how' && (
        <div className="adi-how">
          {STEPS.map(([title, body]) => (
            <div
              key={title}
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  font: '700 13px var(--font-condensed)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--blue-400)',
                }}
              >
                {title}
              </div>
              <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

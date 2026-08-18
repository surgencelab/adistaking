'use client';

import { useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Card, Tabs } from '@/components/ui';
import { LINKS } from '@/lib/config';

const FAQS: [string, string][] = [
  [
    'What are the risks of staking?',
    'Digital assets are volatile and holding ADI Token carries risk of loss. Staked positions are locked for the full term and cannot be accessed early, including during market movements. Rewards are variable and depend on total pool participation. Onchain contracts also carry technical risk. This content is for informational purposes and is not financial advice; please do your own research and consider your own circumstances before acquiring ADI Token.',
  ],
  [
    'What happens to my ADI after I stake?',
    'Staked ADI is transferred to the staking contract and locked for the selected term. Your position is recorded onchain against your wallet address. The contract releases principal at maturity, at which point accrued rewards also become claimable — subject, as with any onchain protocol, to the contract performing as designed.',
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
    'No. Positions are non-withdrawable until the selected lock term ends, including during periods of market volatility. The contract releases principal at maturity, at which point accrued rewards also become claimable.',
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
  // One answer open at a time — the list stays scannable instead of becoming a wall.
  const [open, setOpen] = useState<number | null>(0);

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map(([question, answer], i) => {
            const isOpen = open === i;
            return (
              <div key={question} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    padding: '18px 2px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    font: '600 15px var(--font-body)',
                    color: isOpen ? 'var(--text-heading)' : 'var(--text-body)',
                    transition: 'color var(--dur-fast) var(--ease-standard)',
                  }}
                >
                  {question}
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    style={{
                      flexShrink: 0,
                      color: 'var(--text-faint)',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform var(--dur-base) var(--ease-standard)',
                    }}
                  />
                </button>
                {isOpen && (
                  <p
                    style={{
                      font: 'var(--type-small)',
                      color: 'var(--text-muted)',
                      margin: '0 0 20px',
                      maxWidth: '68ch',
                      animation: 'adiFadeUp var(--dur-base) var(--ease-standard)',
                    }}
                  >
                    {answer}
                  </p>
                )}
              </div>
            );
          })}
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

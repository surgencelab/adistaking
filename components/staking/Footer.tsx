import { ArrowUpRight } from 'lucide-react';
import { LINKS, STAKING_ADDRESS, TOKEN_ADDRESS } from '@/lib/config';
import { explorerAddressUrl } from '@/lib/chains';
import { RiskDisclosure } from './RiskDisclosure';

const ZERO = '0x0000000000000000000000000000000000000000';

export function Footer() {
  const links: { label: string; href: string; external: boolean }[] = [
    { label: 'Terms & Conditions', href: LINKS.terms, external: false },
    { label: 'Docs', href: LINKS.docs, external: true },
    { label: 'Get ADI', href: LINKS.getAdi, external: true },
    {
      label: 'Staking Contract',
      href: STAKING_ADDRESS === ZERO ? '#' : explorerAddressUrl(STAKING_ADDRESS),
      external: STAKING_ADDRESS !== ZERO,
    },
    {
      label: 'Token Contract',
      href: TOKEN_ADDRESS === ZERO ? '#' : explorerAddressUrl(TOKEN_ADDRESS),
      external: TOKEN_ADDRESS !== ZERO,
    },
    { label: 'Audits', href: LINKS.audits, external: true },
    { label: 'Dune', href: LINKS.dune, external: true },
  ];

  return (
    <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '34px 20px 46px' }}>
      <RiskDisclosure variant="full" />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.external ? '_blank' : undefined}
          rel={l.external ? 'noopener noreferrer' : undefined}
          style={{
            font: '700 12px var(--font-condensed)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {l.label}
          {l.external && <ArrowUpRight size={12} strokeWidth={2} />}
        </a>
      ))}
      </div>
    </footer>
  );
}

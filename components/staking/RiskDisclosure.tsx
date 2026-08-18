import { TOKEN_SYMBOL } from '@/lib/config';

/**
 * Standing risk disclosure, required by the ADI Foundation Marketing Do's &
 * Don'ts §5.4. The wording is taken verbatim from that document's DO column —
 * do not paraphrase it without Compliance sign-off.
 *
 * §5.4 also forbids burying the disclosure in a linked page, and §7.5 requires
 * it to be prominent rather than obscured by headline promises. That is why the
 * inline variant sits directly beneath the stake CTA, at the point of decision,
 * rather than only in the footer.
 */

const VOLATILITY = `Digital assets are volatile and holding ${TOKEN_SYMBOL} Token carries risk of loss.`;
const NOT_ADVICE = 'This content is for informational purposes and is not financial advice.';
const DYOR = `Please do your own research and consider your own circumstances before acquiring ${TOKEN_SYMBOL} Token.`;

export function RiskDisclosure({ variant }: { variant: 'inline' | 'full' }) {
  if (variant === 'inline') {
    return (
      <p
        style={{
          font: 'var(--type-small)',
          color: 'var(--text-muted)',
          margin: 0,
          paddingTop: 14,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {VOLATILITY} {NOT_ADVICE}
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textAlign: 'center',
      }}
    >
      <span
        style={{
          font: 'var(--type-label)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-caps)',
        }}
      >
        Risk disclosure
      </span>
      <p style={{ font: 'var(--type-small)', color: 'var(--text-muted)', margin: 0 }}>
        {VOLATILITY} {NOT_ADVICE} {DYOR}
      </p>
    </div>
  );
}

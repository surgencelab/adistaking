import { AlertTriangle } from 'lucide-react';

/**
 * Shown only while MOCK_MODE is on. Every figure on the page is sample data in
 * that state, and the page is otherwise indistinguishable from a live one — so
 * it says so, unmissably, rather than leaving a dev-styled toggle bar to carry
 * the disclaimer. Disappears the moment contract addresses are configured.
 */
export function PreviewBanner() {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '10px 20px',
        background: 'var(--warning-tint)',
        borderBottom: '1px solid var(--warning)',
        font: '600 12px var(--font-condensed)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--warning)',
        textAlign: 'center',
      }}
    >
      <AlertTriangle size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
      Preview build — all figures are sample data, not live programme figures
    </div>
  );
}

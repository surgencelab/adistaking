'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui';
import { mock } from '@/lib/mock';

export interface DemoState {
  seeded: boolean;
  capReached: boolean;
  programEnded: boolean;
}

/**
 * Review-only control bar. Renders only while MOCK_MODE is on, so it disappears
 * the moment real contract addresses are configured.
 */
export function DemoBar({ state, onChange }: { state: DemoState; onChange: (next: DemoState) => void }) {
  const queryClient = useQueryClient();

  const setSeeded = (seeded: boolean) => {
    if (seeded) mock.seed();
    else mock.clearPositions();
    queryClient.invalidateQueries({ queryKey: ['adi'] });
    onChange({ ...state, seeded });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        // Clear of the Next.js dev indicator in the bottom-left corner.
        left: 64,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 150,
        opacity: 0.92,
      }}
    >
      <span
        style={{
          font: 'var(--type-label)',
          color: 'var(--text-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Demo states
      </span>
      <Switch
        checked={state.seeded}
        onChange={setSeeded}
        ariaLabel="Seed positions"
        label={<span style={{ font: 'var(--type-small)' }}>Seed positions</span>}
      />
      <Switch
        checked={state.capReached}
        onChange={(capReached) => onChange({ ...state, capReached })}
        ariaLabel="Cap reached"
        label={<span style={{ font: 'var(--type-small)' }}>Cap reached</span>}
      />
      <Switch
        checked={state.programEnded}
        onChange={(programEnded) => onChange({ ...state, programEnded })}
        ariaLabel="Program ended"
        label={<span style={{ font: 'var(--type-small)' }}>Program ended</span>}
      />
    </div>
  );
}

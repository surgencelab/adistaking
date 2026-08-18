# ADI Staking

Production Next.js app for the ADI staking page, built from the **ADI Staking Design System**
handoff. Dark navy surfaces, electric blue `#2E5BFF` for interaction only, teal `#2BE4C0`
for data only, condensed uppercase pill buttons, Archivo display type.

```bash
npm run dev    # http://localhost:3025
npm run build
```

## Where the real contracts plug in

The app runs today against a mock data layer. **One file switches it to the chain:**

```bash
# .env.local
NEXT_PUBLIC_STAKING_ADDRESS=0x…
NEXT_PUBLIC_TOKEN_ADDRESS=0x…
```

`lib/config.ts` derives `MOCK_MODE` from those two values. Every hook in `lib/hooks/`
branches on it and returns the identical shape either way, so **no component knows which
side it is on**. Setting the addresses also removes the demo wallet connector and the
Demo States bar automatically.

When you flip it, expect to touch exactly three things:

| File | What to reconcile |
|---|---|
| `lib/contracts.ts` | The staking ABI is **derived from what the UI needs**, not from a real artifact. Reconcile function names and output shapes against the deployed ABI. |
| `lib/hooks/usePoolData.ts` | `tvlUsd` returns `0` in live mode — there is no price oracle in the staking contract. Wire a price feed. |
| `lib/hooks/usePoolData.ts` | `useActivity` and `useVolume` need an indexer (subgraph or Dune); no contract read covers them, so they stay on mock until that exists. |

Delete `lib/mock.ts` once you no longer need the review build. Nothing outside `lib/hooks/`
and `components/staking/DemoBar.tsx` imports it.

## ADI Chain

No chain id, RPC, or explorer was supplied. `lib/chains.ts` is env-driven and **falls back
to Ethereum mainnet** so wallet connection, network detection, and switch-network are
genuinely exercisable today rather than permanently stuck on a wrong-network banner.

```bash
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CHAIN_NAME=ADI Chain
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_EXPLORER_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=   # optional; without it, injected + Coinbase only
```

## Disclosure phases

Derived from real state, not a toggle — `components/staking/StakingPage.tsx`:

| Phase | Condition | Shows |
|---|---|---|
| **explore** | disconnected | Pool cap / APY / program window. Stakers, avg lock, stat tiles and pool activity gated behind connect. |
| **stake** | connected, no positions | Pool basics, minimum stake (100 ADI), per-term APY. Pool activity still gated. |
| **manage** | connected with positions | Positions table with actions, volume chart, full pool composition and recent activity. |

## Earnings estimate

`components/staking/EarningsEstimate.tsx` sits in the stake form between the summary rows
and the CTA — per month and per year at the selected term's APY, read before committing to
an amount.

Before an amount is typed it previews against the connected wallet's balance, falling back
to `EXAMPLE_STAKE` (1,000 ADI) when disconnected, and says which it used. All four figures
— per month, per year, at maturity, and predicted APY — come from one function,
`estimateEarnings` in `lib/earnings.ts`, so the stake form's "Est. rewards" row can never
drift from the panel.

The per-year figure is annualised, not attainable, on any term shorter than a year; the
caption says so, and pairs it with the standing "APY is variable" caveat from the FAQ.

## Layout

```
app/
  layout.tsx          fonts, theme boot script, providers
  page.tsx
  globals.css         layout grids, breakpoints, light-theme contrast corrections
  styles/             design-system tokens, copied verbatim — safe to re-sync
components/
  ui/                 19 design-system components, ported to typed TSX
  staking/            page sections
  providers/          wagmi + react-query, toasts
lib/
  config.ts           ← the swap point
  chains.ts  wagmi.ts  contracts.ts  format.ts  types.ts  mock.ts
  hooks/              one hook per read; useStakeActions for every write
```

`app/styles/` is a verbatim copy of the handoff's `tokens/`. Corrections live in
`globals.css` instead, so re-copying the design system's tokens never silently undoes them.

## Craft notes

Decisions that carry the page's feel, so they survive future edits:

- **Two-tone numerals** (`components/ui/Figure.tsx`). Every figure splits into a value and
  a subordinate unit — `12,847` at full contrast, `ADI` stepped back in size, weight, and
  colour. The brand rule that numbers always carry units is kept without letting the unit
  compete with the number. Use `Figure` for any new number; do not hand-set one.
- **Scale contrast carries hierarchy.** Stat figures run at 42px against 11px labels. The
  labels are deliberately quiet — if everything is emphasised, nothing is.
- **Dual denomination** where a second unit is meaningful: `$3.24M` over `251,415 ADI at
  the current price`.
- **No legend squares.** Series keys use thin rounded line swatches matching the stroke,
  not `■` glyphs.
- **The CTA names the blocker** — "Enter an amount", "Minimum 100 ADI", "Insufficient
  balance" — instead of failing on click. The step hint only appears once there is
  something submittable, so it never contradicts the button.
- **The chart is interactive**, not decorative: range control, crosshair, floating readout,
  and a header figure that tracks the hovered point.
- **No developer scaffolding in the UI.** Notes about indexers and placeholder data belong
  in this file, not on the page.

## Deviations from the handoff, and why

- **Light theme contrast.** The handoff flags its light palette as extrapolated from
  dark-only screenshots ("verify before shipping"). Two tokens fail WCAG AA on white:
  `--text-faint` (~2.5:1) and `--positive` used as text (~2.1:1). Corrected in
  `globals.css` for light mode only. `--teal-400` is untouched, so progress bars and the
  composition ramp keep their data colour.
- **Icons are Lucide**, per the handoff's iconography rule, replacing the kit's text
  glyphs (✓ ⓘ ▾ ✕).
- **The wallet address button is not uppercased.** Every other pill button is, per the
  brand rule, but addresses are checksummed and uppercasing corrupts the casing.
- **Mobile grid overflow fixed.** Grid items default to `min-width: auto`, so the
  positions table's `min-width: 680px` pushed the whole column past the viewport instead
  of scrolling inside `.adi-scroll`.
- **Hero type scales down below 560px** (56px wrapped to three lines on a phone).
- **A shared clock (`lib/hooks/useNow.ts`)** drives countdowns and lock progress. Reading
  `Date.now()` during render is impure and only advances when something else re-renders;
  this also makes the "next unlock" countdown tick on its own.

## Still needed from you

1. **The logo.** The real mark is an orange/blue diamond; the brand rule is never to
   redraw it. `components/staking/Wordmark.tsx` renders the wordmark in type with a dashed
   placeholder and probes for `public/adi-mark.svg` — drop the file in and it appears.
2. **Brand fonts.** Archivo / Archivo Narrow / IBM Plex Mono are Google-font stand-ins.
   Swap them in `app/layout.tsx`.
3. **Hex values.** Every colour was eyeballed from screenshots. Check `app/styles/colors.css`
   against the app's real config.
4. **Footer link destinations** — `LINKS` in `lib/config.ts` still carries placeholder hrefs
   for terms, docs, audits, and Dune.

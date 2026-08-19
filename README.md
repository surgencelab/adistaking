# ADI Staking

The staking interface for the ADI token programme on ADI Chain. Next.js 16, wagmi v3,
viem. Dark navy surfaces, electric blue `#2E5BFF` for interaction, teal `#2BE4C0` for data,
condensed uppercase pill buttons, Archivo display type.

```bash
npm install
npm run dev      # http://localhost:3025
npm run build
```

## Configuration

The app reads live contract state when addresses are configured, and serves a local data
layer when they are not. **Two variables decide which:**

```bash
# .env.local
NEXT_PUBLIC_STAKING_ADDRESS=0x…
NEXT_PUBLIC_TOKEN_ADDRESS=0x…
```

`lib/config.ts` derives `MOCK_MODE` from those two values. Every hook in `lib/hooks/`
branches on it and returns the identical shape either way, so **no component knows which
side it is on**. Configuring them also removes the demo connector and the Demo States bar.

Full variable list in `.env.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STAKING_ADDRESS` | Staking contract. Enables live reads and writes. |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | ERC-20 $ADI. Enables balance and allowance reads. |
| `NEXT_PUBLIC_CHAIN_ID` | ADI Chain id. Falls back to Ethereum mainnet in development. |
| `NEXT_PUBLIC_CHAIN_NAME` | Display name in the network badge and banners. |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint for contract reads. |
| `NEXT_PUBLIC_EXPLORER_URL` | Base URL for address and transaction links. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional. Without it, injected + Coinbase only. |

### Going live

Three things to settle when the contracts are deployed:

| File | What to do |
|---|---|
| `lib/contracts.ts` | Reconcile the staking ABI against the deployed contract. Nothing outside this file and `lib/hooks/` references an ABI. |
| `lib/hooks/usePoolData.ts` | `tvlUsd` returns `0` without a price oracle — wire a price feed. |
| `lib/hooks/usePoolData.ts` | `useActivity` and `useVolume` need an indexer (subgraph or Dune); no contract read covers pool-wide history. |

Then delete `lib/mock.ts`.

## Deployment

Deploys to Vercel with no additional configuration — it is a standard Next.js App Router
project. Set the variables above in **Project Settings → Environment Variables** before the
first production deploy; they are all `NEXT_PUBLIC_*`, so they are baked in at build time
and a change requires a redeploy.

## Disclosure phases

Derived from real state rather than a toggle — `components/staking/StakingPage.tsx`:

| Phase | Condition | Shows |
|---|---|---|
| **explore** | disconnected | Pool cap, APY, programme window. Stakers, average lock, stat tiles and pool activity gated behind connect. |
| **stake** | connected, no positions | Pool basics, minimum stake (100 ADI), per-term APY. Pool activity still gated. |
| **manage** | connected with positions | Positions table with actions, volume chart, full pool composition and recent activity. |

## Estimated rewards

`components/staking/EarningsEstimate.tsx` sits in the stake form between the summary rows
and the CTA — per month and per year, read before committing to an amount.

**It reads zero until an amount is entered.** Nothing is projected against the wallet
balance or a stand-in principal: an estimate the reader did not ask for is an unsolicited
return projection, and the zero state makes the figures plainly a consequence of their own
input.

The rate quoted is the **pool APY (~18.00%)**, not a term-boosted rate. The lock multiplier
is a weighting on a position's share of the reward pool, as the FAQ describes it, so
quoting `18% x 1.75` as an APY overstated it. `APY_INCLUDES_LOCK_MULTIPLIER` in
`lib/config.ts` flips that in one line if the programme's economics say otherwise.

Every figure comes from `estimateEarnings` in `lib/earnings.ts`, so the quoted rate and the
reward figures cannot drift apart. The per-year figure is annualised, not attainable, on
any term shorter than a year; the caption says so.

## Layout

```
app/
  layout.tsx          fonts, theme boot, providers
  page.tsx
  globals.css         layout grids, breakpoints, light-theme contrast corrections
  styles/             design-system tokens — re-syncable from source, do not edit
components/
  ui/                 design-system components as typed TSX
  staking/            page sections
  providers/          wagmi + react-query, toasts
lib/
  config.ts           mock/live switch and programme parameters
  chains.ts  wagmi.ts  contracts.ts  earnings.ts  figures.ts  format.ts  types.ts  mock.ts
  hooks/              one hook per read; useStakeActions for every write
```

`app/styles/` is a verbatim copy of the design system's tokens. Corrections live in
`globals.css` instead, so re-syncing tokens never silently undoes them.

## Craft notes

Decisions that carry the page's feel, so they survive future edits:

- **Two-tone numerals** (`components/ui/Figure.tsx`). Every figure splits into a value and
  a subordinate unit — `12,847` at full contrast, `ADI` stepped back in size, weight, and
  colour. Numbers always carry their units without the unit competing with the number. Use
  `Figure` for any new number; do not hand-set one.
- **Scale contrast carries hierarchy.** Stat figures run at 42px against 11px labels. The
  labels are deliberately quiet — if everything is emphasised, nothing is.
- **Dual denomination** where a second unit is meaningful: `$3.24M` over `251,415 ADI at
  the current price`.
- **No legend squares.** Series keys use thin rounded line swatches matching the stroke.
- **The CTA names the blocker** — "Enter an amount", "Minimum 100 ADI", "Insufficient
  balance" — instead of failing on click. The step hint only appears once there is
  something submittable, so it never contradicts the button.
- **The chart is interactive**, not decorative: range control, crosshair, floating readout,
  and a header figure that tracks the hovered point.
- **The wallet address is not uppercased.** Every other pill button is, per the brand rule,
  but addresses are checksummed and uppercasing corrupts the casing.
- **A shared clock** (`lib/hooks/useNow.ts`) drives countdowns and lock progress. Reading
  `Date.now()` during render is impure and only advances when something else re-renders;
  this also makes the countdown tick on its own.
- **Grid children carry `min-width: 0`.** Grid items default to `min-width: auto`, which
  would let the positions table's minimum width push past the viewport instead of scrolling
  inside `.adi-scroll`.

## Assets

The brand mark loads from `public/adi-mark.svg` and is never redrawn in code; until that
file is present the wordmark stands alone in type. Archivo, Archivo Narrow, and IBM Plex
Mono are loaded via `next/font` in `app/layout.tsx`.

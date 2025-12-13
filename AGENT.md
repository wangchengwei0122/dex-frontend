# AGENT Guide

## Stack & Entry Points

- Next.js 16 (app router) + TypeScript; Tailwind v4 via `app/globals.css`.
- Wagmi + RainbowKit for wallets; Query client in `providers/wallet-provider.tsx`; wagmi config in `app/wagmi.ts` (chains: mainnet, sepolia, hardhat).
- Main surface is the swap flow: `app/page.tsx` renders `components/swap/SwapCard`.
- UI primitives live in `components/app` (AppButton/AppPanel/AppInput/…); shadcn base components under `components/ui`.

## Runbook

- Install deps: `pnpm install` (lockfile present).
- Dev server: `pnpm dev`; build: `pnpm build`; start prod: `pnpm start`.
- Lint/format: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`.

## Design System (Black & Gold)

- Source of truth: `docs/design-system.md` + tokens in `app/globals.css` (CSS vars `--black-*`, `--gold-*`, `--error-*`, radius/shadow tokens). `.cursor/rules/design-system.mdc` enforces adherence.
- Do not invent colors/shadows/radii; reuse CSS vars or constants in `config/theme.ts`.
- Prefer existing primitives (AppButton/AppInput/AppPanel/AppBadge/AppSectionTitle/AppFieldLabel) instead of raw elements. Keep variants/sizes intact.
- Layout defaults: page bg `var(--black-900)`, container `max-w-screen-xl mx-auto px-4`, navbar ~64px with brand left/nav center/wallet right.

## Swap Domain Notes

- Chain config lives in `config/chains.ts` (names, explorer base URL, router/WETH, `SUPPORTED_CHAIN_IDS`, `PREFERRED_CHAIN_ID`, `getDexChainConfig`, explorer URL builder).
- Token config: `config/tokens.ts` (+ per-chain lists in `config/tokens/mainnet.ts`, `config/tokens/sepolia.ts`); tokens carry `priority`, `isStable`, `tags`, `isNative`/`wrappedAddress`, and are sorted by priority in `getTokensByChainId`.
- Uniswap V2 addresses still surfaced via `config/contracts.ts`, but router/WETH helpers now read from chain config.
- Swap engine lives under `features/swap/engine` (types/errors + hooks: `useSwapForm`, `useSwapQuote`, `useSwap`, `useTokenAllowance`, `useTokenApproval`, `usePairReserves`, helpers in `utils.ts`; barrel `index.ts`).
- `useSwapQuote`: debounced (400ms) `getAmountsOut` via public client; enabled only when wallet connected and inputs valid; errors mapped to user-friendly strings; returns `amountOutWei` plus slippage-adjusted `amountOutMinWei`/formatted min (pass `slippageBps`).
- `useSwap`: ERC20→ERC20 `swapExactTokensForTokens` with simulate/write/wait; builds direct path only (no WETH hop/native support); exposes status/error/txHash.
- Price impact: `usePairReserves` fetches router→factory→pair (token0/1 + reserves) and `calcPriceImpact` approximates % change from reserves + quote amounts.
- `useTokenBalances` remains in `lib/hooks` for balance fetch; allowance/approval hooks are in the engine.
- `components/swap/SwapCard` orchestrates selection, balances, allowance/approve, quote, swap, settings (slippage/deadline), price impact, recent swaps, and passes state to subcomponents (`TokenAmountInput`, `SwapFooter`, dialogs, etc.). Primary action handles unsupported-network state and optional switchChain; defaults reset per chain.
- `TokenSelectDialog` is chain-scoped, searchable (symbol/name), priority-ordered, and blocks selecting the same token on both sides; shows unsupported-network notice.
- Minimum received & price impact UI: `SwapFooter` shows rate, expected output, minimum received (from quote + slippage), and price impact (red highlight when large); hides details when no valid quote.
- Recent swaps: storage helpers in `features/swap/recentSwaps.ts` (localStorage CRUD, latest 20) and display via `components/swap/RecentSwaps.tsx`; `SwapCard` records pending swap before calling `swap`, updates status/tx hash on lifecycle changes, and renders recent list below the card.

## UI Implementation Notes

- AppPanel/AppButton already set gold glow/borders via inline styles and `config/theme.ts`; match their conventions instead of new CSS.
- Use monospace for key numerics; section labels use uppercase + wide tracking (see AppSectionTitle/AppFieldLabel).
- Tailwind spacing sticks to 4px scale; common gaps/padding: `px-4/6/8`, `py-6/8`, `gap-3/4`.
- RainbowKit styling tweaks live in `app/globals.css` under `@layer components`.

## Useful Docs

- `docs/design-system.md`: visual tokens and component specs.
- `docs/component-rules.md`: mandatory component layering and extraction rules..
- `docs/component-specs.md`: generic UI baseline (sizes/states).
- `docs/quote-quick-start.md` & `docs/swap-quote-integration.md`: swap quote flow rationale and testing steps.

## Quick Pitfalls

- Swap hooks only handle direct ERC20 pairs; native ETH currently unsupported in `useSwap`.
- Some existing files still use hardcoded hex colors; when editing, migrate toward shared tokens instead of adding new values.
- Supported networks enumerated in `config/chains.ts`; keep UI/error states aligned (unsupported network error has top priority). Extending requires updating chain config + token lists + RainbowKit chains if needed.

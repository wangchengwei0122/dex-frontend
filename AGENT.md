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
- Token/contract config: `config/tokens.ts` (+ `config/tokens/mainnet.ts`, `config/tokens/sepolia.ts`); Uniswap V2 addresses in `config/contracts.ts` (`getUniswapV2RouterAddress`, `getWETHAddress`).
- Core hooks (`lib/hooks`):
  - `useSwapQuote`: debounced (400ms) `getAmountsOut` via public client; enabled only when wallet connected and inputs valid; errors mapped to user-friendly strings.
  - `useSwap`: ERC20→ERC20 `swapExactTokensForTokens` with simulate/write/wait; builds direct path only (no WETH hop/native support); exposes status/error/txHash.
  - `useTokenBalances`, `useTokenAllowance`, `useTokenApproval` wrap balance/allowance/approve flows.
- `components/swap/SwapCard` orchestrates selection, balances, allowance/approve, quote, swap, settings (slippage/deadline) and passes state to subcomponents (`SwapTokenRow`, `SwapFooter`, dialogs, etc.). Primary action auto-switches between connect/select/approve/swap states and shows errors.

## UI Implementation Notes
- AppPanel/AppButton already set gold glow/borders via inline styles and `config/theme.ts`; match their conventions instead of new CSS.
- Use monospace for key numerics; section labels use uppercase + wide tracking (see AppSectionTitle/AppFieldLabel).
- Tailwind spacing sticks to 4px scale; common gaps/padding: `px-4/6/8`, `py-6/8`, `gap-3/4`.
- RainbowKit styling tweaks live in `app/globals.css` under `@layer components`.

## Useful Docs
- `docs/design-system.md`: visual tokens and component specs.
- `docs/component-specs.md`: generic UI baseline (sizes/states).
- `docs/quote-quick-start.md` & `docs/swap-quote-integration.md`: swap quote flow rationale and testing steps.

## Quick Pitfalls
- Swap hooks only handle direct ERC20 pairs; native ETH currently unsupported in `useSwap`.
- Some existing files still use hardcoded hex colors; when editing, migrate toward shared tokens instead of adding new values.
- Network list limited to mainnet/sepolia; extending requires updates to `config/contracts.ts`, `config/tokens/*`, and RainbowKit chains if needed.

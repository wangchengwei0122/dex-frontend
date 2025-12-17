# dex-frontend

## 1. Project Overview
- Uniswap-style DEX frontend for demos and interviews; focuses on UX and protocol literacy rather than a full backend.
- Interview showcase project targeting Web3 Frontend / Senior Frontend roles.

## 2. Why I Built This
- To demonstrate applied understanding of DEX mechanics (Uniswap V2-style flows) and Web3 UX patterns.
- To show engineering rigor in a production-like frontend: typed data flows, contract abstractions, wallet UX, and visual polish.
- To validate my ability to integrate onchain reads/writes while keeping the app modular and test-chain friendly (Sepolia-first).

## 3. Key Features
- Wallet connect via RainbowKit (MetaMask and other EVM wallets).
- Token swap UI with basic quote logic and intent validation.
- Token list and token detail UI with icons/symbols, decimals, and chain-aware metadata.
- Network switching for supported testnets (Sepolia) with graceful fallbacks.
- Price/liquidity/basics surfaced in the swap/pool context (lightweight, not full analytics).
- Black/gold design language with motion accents; Tailwind-driven design system for consistent spacing/typography.
- Live demo: https://dex-frontend-bice.vercel.app  
- Screenshot placeholder: _(Insert homepage screenshot here)_.

## 4. Architecture & Design Decisions
- **Next.js App Router**: file-system routing + server components where useful; good DX for data fetching and layout composition.
- **wagmi + viem** instead of direct ethers: typed hooks, chain-aware clients, better caching, leaner bundles, and first-class React ergonomics.
- **Frontend/contract decoupling**: onchain reads/writes are funneled through small adapter hooks; UI consumes typed domain objects rather than raw RPC responses.
- **Token/chain config**: centralized token registry and chain config (symbol, decimals, addresses, RPC, explorers) to make multi-chain/token additions a data change, not a refactor.
- **Extensibility**: componentized swap form, shared formatting utilities, and reusable query hooks so adding Pools/Positions reuses primitives (balances, allowances, approvals, LP math stubs).
- **Type safety & linting**: TypeScript everywhere, strict linting/formatting; avoids runtime surprises in contract interactions.

## 5. What This Project Demonstrates
- Web3 frontend depth: wallet flows, network handling, contract read/write ergonomics.
- DEX/DeFi fundamentals: V2-style swap pathing, slippage/allowance considerations, and liquidity displays (lightweight).
- Frontend engineering: component composition, state separation, typed data models, and maintainable styling via Tailwind tokens.
- UI/UX sensibility: theme consistency, meaningful animations, and clear affordances for risky actions (e.g., approvals).
- Self-driven delivery: scoped a realistic slice of a DEX, iterated on design/dev alone, and documented trade-offs.

## 6. What’s Next / Roadmap
- Pool page improvements (APR/volume surfacing, better pair discovery).
- Liquidity management flows: add/remove liquidity, approvals, position summaries.
- More accurate pricing: mid-price vs execution price, slippage warnings, route simulation.
- Multi-chain expansion with per-chain token lists and RPC fallbacks.
- Performance/UX polish: optimistic UI for approvals/swaps, skeleton states, better error surfaces.

## 7. How to Run Locally
```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

## 8. Disclaimer
- Non-production; built for learning, interviews, and portfolio demonstration.
- Uses testnets by default (Sepolia); do not treat as financial software.

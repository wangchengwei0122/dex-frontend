🔒 Component Layer Rules (Short Version)

1. Base Components = UI Primitives Only
   • components/app/\* ONLY contains UI primitives
   (Button / Input / Select / Dialog / Popover / Tabs / Badge / Panel / Tooltip …)
   • ❌ No business or domain semantics
   (Token / Pair / Swap / Quote / Price / Transaction)
   • ❌ No DEX-specific logic
   • ✅ Styling, variants, states, accessibility only

⸻

2. Shared Business Components Must Be Extracted
   • Reusable business display units MUST NOT be written inline in pages or containers
   • Examples:
   • Token components (TokenRow / TokenCard / TokenAvatar)
   • Key-value rows (InfoRow)
   • Numeric displays (AmountText / PriceText / PercentText)
   • Status badges (pending / success / failed)
   • Icon + text patterns
   • Place in:
   • components/shared/_ (preferred)
   • or components/<feature>/shared/_

⸻

3. No Page Dumping (Feature Components Required)
   • Any UI block with clear business meaning MUST be a feature component
   (even if used only once)
   • ❌ Do NOT stack business UI directly in page.tsx
   • ❌ Do NOT write large JSX blocks in container components
   • Pages / containers only:
   • Layout
   • State orchestration
   • Component composition

⸻

4. Mandatory Classification Order

When adding a component, classify in this order: 1. UI primitive → components/app 2. Reusable business unit → components/shared 3. Feature-specific block → components/<feature>

Default bias:
If unsure, extract the component.

⸻

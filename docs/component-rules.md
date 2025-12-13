# Component Layer Rules

These rules define **mandatory component layering and extraction constraints**.

All newly introduced components **MUST** comply with the following rules.  
Violations are considered **incorrect implementations**.

---

## 1. Base Components = UI Primitives Only

**Scope:** `components/app/*`

- `components/app/*` is strictly reserved for **UI primitives only**.
- Examples:
  - Button / Input / Select / Dialog / Popover / Tabs
  - Badge / Panel / Tooltip / Dropdown / Switch / Checkbox

### Allowed

- Styling normalization
- Variants and sizes (`sm / md / lg`, `primary / ghost / danger`, etc.)
- Interaction states (hover / active / disabled / loading / error)
- Accessibility and keyboard behavior

### Not Allowed

- Any business or domain semantics  
  (Token / Pair / Swap / Quote / Price / Transaction)
- Any DEX-specific logic or assumptions

**Rule of thumb:**  
If the component still makes sense outside a DEX or crypto context, it may belong here.  
Otherwise, it does not.

---

## 2. Shared Business Components Must Be Abstracted

Reusable **business-level display units MUST NOT be written inline** in pages or container components.

They **MUST** be extracted into shared business components.

### Common Examples

- Generic token components  
  (`TokenRow`, `TokenCard`, `TokenAvatar`, `TokenPill`)
- Key-value / info rows  
  (`InfoRow`, `KeyValueRow`)
- Reusable numeric displays  
  (`AmountText`, `PriceText`, `PercentText`)
- Status indicators  
  (`StatusBadge` – pending / success / failed)
- Icon + text patterns  
  (`IconText`, `LabeledIcon`)

### Placement

- `components/shared/*` → cross-feature shared (preferred)
- `components/<feature>/shared/*` → feature-scoped shared

### Constraints

- Must strictly follow the existing Design System  
  (CSS variables, `config/theme.ts`)
- Do NOT introduce new colors, shadows, or radii
- Component APIs must be stable and semantic  
  (do NOT pass raw page state or container logic directly)

---

## 3. Feature Components Are Mandatory (No Page Dumping)

Any UI block with **clear business meaning** MUST be extracted into a feature component,
even if it is currently used only once.

### Examples

- Trading pair / pool item
- Recent swap item or recent swaps list
- Quote summary block (rate, min received, price impact)
- Approval / swap status blocks
- Domain-specific empty or error states

### Placement

- `components/swap/*`
- or the corresponding feature directory  
  (e.g. `components/pairs/*`, `components/positions/*`)

### Hard Rules

- Do NOT stack business UI blocks directly inside `page.tsx`
- Do NOT write large JSX + Tailwind structures in container components
- Pages and containers are responsible ONLY for:
  - Layout
  - State orchestration
  - Data flow
  - Composing feature components

---

## 4. Mandatory Component Classification Order

When introducing a new component, you MUST classify it in the following order:

1. **UI Primitive** → `components/app`
2. **Reusable business display unit** → `components/shared`
3. **Feature-specific business block** → `components/<feature>`

**Default bias:**  
If uncertain, extract the component.  
Over-abstraction is preferred to page-level dumping.

---

## 5. Enforcement Principle

Component layering rules take priority over:

- Convenience
- Local refactoring shortcuts
- Temporary “just for this page” implementations

Any deviation must be explicitly justified and approved.

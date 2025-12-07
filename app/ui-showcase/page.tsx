"use client"

import { AppButton } from "@/components/app/app-button"
import {
  AppCard,
  AppCardContent,
  AppCardDescription,
  AppCardHeader,
  AppCardTitle,
} from "@/components/app/app-card"
import { AppInput } from "@/components/app/app-input"
import { AppBadge } from "@/components/app/app-badge"
import { AppSectionTitle } from "@/components/app/app-section-title"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { AppPanel } from "@/components/app/app-panel"
import { AppDivider } from "@/components/app/app-divider"
import { AppDialog, AppDialogTrigger, AppDialogContent } from "@/components/app/app-dialog"
import { AppPopover, AppPopoverTrigger, AppPopoverContent } from "@/components/app/app-popover"
import { Search, Settings, Info, ChevronDown } from "lucide-react"
import { TokenButton } from "@/components/global/tokenButton"

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-[#050507] text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#141417] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] shadow-[0_0_18px_rgba(201,162,39,0.35)] backdrop-blur">
            Black & Gold DEX Theme
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-zinc-50">DEX Design System</h1>
            <p className="max-w-3xl text-sm text-zinc-400">
              High-contrast trading UI with bright gold accents, crisp black surfaces, and glassy
              inputs for a premium Web3 exchange experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton variant="primary">Primary Action</AppButton>
            <AppButton variant="secondary">Secondary</AppButton>
            <AppButton variant="outline">Ghost Outline</AppButton>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Buttons</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Variants
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton variant="primary" size="sm">
                    Primary
                  </AppButton>
                  <AppButton variant="secondary" size="sm">
                    Secondary
                  </AppButton>
                  <AppButton variant="ghost" size="sm">
                    Ghost
                  </AppButton>
                  <AppButton variant="outline" size="sm">
                    Outline
                  </AppButton>
                  <AppButton variant="danger" size="sm">
                    Danger
                  </AppButton>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Sizes
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Small</AppButton>
                  <AppButton size="md">Medium</AppButton>
                  <AppButton size="lg">Large</AppButton>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  States
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Default</AppButton>
                  <AppButton size="sm" loading>
                    Loading
                  </AppButton>
                  <AppButton size="sm" disabled>
                    Disabled
                  </AppButton>
                </div>
              </div>
            </div>
          </AppPanel>

          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Inputs</AppSectionTitle>
            <div className="space-y-3">
              <div>
                <AppFieldLabel>Default Input</AppFieldLabel>
                <AppInput placeholder="0.0" />
              </div>
              <div>
                <AppFieldLabel>Focus</AppFieldLabel>
                <AppInput
                  placeholder="2,500"
                  className="border-amber-400 ring-2 ring-amber-300/60 ring-offset-2 ring-offset-white"
                />
              </div>
              <div>
                <AppFieldLabel>Error State</AppFieldLabel>
                <AppInput error placeholder="Invalid amount" />
              </div>
              <div>
                <AppFieldLabel>Disabled</AppFieldLabel>
                <AppInput disabled placeholder="Disabled" />
              </div>
            </div>
          </AppPanel>

          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Badges & Chips</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Variants
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppBadge variant="primary">Primary</AppBadge>
                  <AppBadge variant="success">Success</AppBadge>
                  <AppBadge variant="warning">Warning</AppBadge>
                  <AppBadge variant="error">Error</AppBadge>
                  <AppBadge variant="default">Default</AppBadge>
                  <AppBadge variant="outline">Outline</AppBadge>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Sizes
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppBadge size="sm" variant="primary">
                    Small
                  </AppBadge>
                  <AppBadge size="md" variant="primary">
                    Medium
                  </AppBadge>
                  <AppBadge size="lg" variant="primary">
                    Large
                  </AppBadge>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div className="flex flex-wrap items-center gap-2">
                <TokenButton label="ETH" />
                <TokenButton label="USDC" />
                <TokenButton label="ARB" />
                <TokenButton label="OP" />
              </div>
            </div>
          </AppPanel>

          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Cards</AppSectionTitle>
            <div className="grid gap-3 md:grid-cols-3">
              <AppCard variant="default">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-50">Default Card</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-400">
                    Bright glass surface
                  </AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-50">
                  1.234 ETH
                </AppCardContent>
              </AppCard>
              <AppCard variant="bordered">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-50">Gold Border</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-400">
                    Amber accent outline
                  </AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-50">
                  +$235.4
                </AppCardContent>
              </AppCard>
              <AppCard variant="elevated">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-50">Elevated</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-400">
                    Deeper shadow
                  </AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-50">
                  ROI 12.4%
                </AppCardContent>
              </AppCard>
            </div>
          </AppPanel>
        </div>

        <AppPanel variant="dark" className="space-y-5">
          <AppSectionTitle withDivider>Typography</AppSectionTitle>
          <div className="space-y-2">
            <AppSectionTitle as="h1" className="text-zinc-50">
              Heading 1
            </AppSectionTitle>
            <AppSectionTitle as="h2" className="text-zinc-50">
              Heading 2
            </AppSectionTitle>
            <AppSectionTitle as="h3" className="text-zinc-200">
              Heading 3
            </AppSectionTitle>
            <div className="text-sm font-medium text-zinc-200">Body text on dark surfaces</div>
            <div className="text-xs text-zinc-500">Muted caption in zinc palette</div>
          </div>
        </AppPanel>

        <AppPanel variant="dark" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="relative pb-2 text-sm font-medium text-white hover:text-[#C9A227] transition hover:shadow-[0_0_14px_rgba(201,162,39,0.2)]">
                Swap
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#C9A227]" />
              </button>
              <button className="pb-2 text-sm font-medium text-white/60 hover:text-[#C9A227] transition hover:shadow-[0_0_14px_rgba(201,162,39,0.15)]">
                Pro
              </button>
            </div>
            <AppButton variant="ghost" size="sm" className="text-[#C9A227]">
              ⚙️
            </AppButton>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <AppFieldLabel className="mb-0 text-[11px] text-zinc-400">From</AppFieldLabel>
                <span className="text-[11px] text-amber-200/80">Balance: 1.234 ETH</span>
              </div>
              <div className="flex items-center gap-2">
                <AppInput className="flex-1 bg-white/95" placeholder="0.0" />
                <TokenButton label="ETH" />
              </div>
            </div>

            <div className="flex justify-center">
              <AppButton
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full bg-black/40 text-[#C9A227] border border-[#C9A227]/30 hover:bg-black/50"
              >
                ⇅
              </AppButton>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <AppFieldLabel className="mb-0 text-[11px] text-zinc-400">To</AppFieldLabel>
                <span className="text-[11px] text-amber-200/80">Balance: 0.0</span>
              </div>
              <div className="flex items-center gap-2">
                <AppInput className="flex-1 bg-white/95" placeholder="0.0" />
                <TokenButton label="USDC" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>1 ETH ≈ 3,524.50 USDC</span>
              <span>Slippage 0.30%</span>
            </div>

            <AppButton
              variant="primary"
              className="w-full py-3 text-base shadow-[0_12px_36px_rgba(201,162,39,0.24)] border border-transparent"
              style={{
                borderImage:
                  "linear-gradient(120deg, rgba(201,162,39,0.85), rgba(201,162,39,0.25)) 1",
              }}
            >
              Swap with Gold Glow
            </AppButton>
          </div>
        </AppPanel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Dialogs</AppSectionTitle>
            <div className="space-y-4">
              <AppDialog>
                <AppDialogTrigger asChild>
                  <AppButton variant="primary">Open token selector</AppButton>
                </AppDialogTrigger>
                <AppDialogContent
                  size="lg"
                  title="Select a token"
                  description="Search tokens across supported networks."
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--gray-500)]" />
                      <AppInput placeholder="Search name or paste address" className="pl-10" />
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {[
                        { name: "Ethereum", symbol: "ETH", balance: "1.234" },
                        { name: "USD Coin", symbol: "USDC", balance: "2,500.00" },
                        { name: "Wrapped ETH", symbol: "WETH", balance: "0.567" },
                        { name: "Arbitrum", symbol: "ARB", balance: "10,000" },
                        { name: "Optimism", symbol: "OP", balance: "5,000" },
                      ].map((token) => (
                        <div
                          key={token.symbol}
                          className="flex items-center justify-between p-3 rounded-xl border border-[var(--gold-border-soft)] bg-[var(--black-800)]/40 hover:bg-[var(--black-700)]/60 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 border border-[var(--gold-border-soft)] flex items-center justify-center">
                              <span className="text-xs font-semibold text-[var(--gold)]">
                                {token.symbol[0]}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-[var(--gray-50)]">
                                {token.name}
                              </span>
                              <span className="text-xs text-[var(--gray-500)]">{token.symbol}</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-[var(--gray-50)] font-mono">
                            {token.balance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AppDialogContent>
              </AppDialog>
            </div>
          </AppPanel>

          <AppPanel variant="dark" className="space-y-5">
            <AppSectionTitle withDivider>Popovers</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Info Tooltip
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppPopover>
                    <AppPopoverTrigger asChild>
                      <AppButton variant="outline" size="sm" className="gap-2">
                        <Info className="size-4" />
                        Hover for info
                      </AppButton>
                    </AppPopoverTrigger>
                    <AppPopoverContent size="sm">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-[var(--gray-50)]">
                          Slippage Tolerance
                        </div>
                        <div className="text-xs text-[var(--gray-500)]">
                          Your transaction will revert if the price changes unfavorably by more than
                          this percentage.
                        </div>
                      </div>
                    </AppPopoverContent>
                  </AppPopover>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Settings Menu
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppPopover>
                    <AppPopoverTrigger asChild>
                      <AppButton variant="ghost" size="sm" className="gap-2">
                        <Settings className="size-4" />
                        Settings
                        <ChevronDown className="size-4" />
                      </AppButton>
                    </AppPopoverTrigger>
                    <AppPopoverContent size="md" align="start">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--gray-500)] mb-2">
                          Swap Settings
                        </div>
                        <div className="space-y-1">
                          {[
                            { label: "Slippage Tolerance", value: "0.5%" },
                            { label: "Transaction Deadline", value: "20m" },
                            { label: "Expert Mode", value: "Off" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--black-800)]/60 cursor-pointer transition-colors"
                            >
                              <span className="text-sm text-[var(--gray-50)]">{item.label}</span>
                              <span className="text-sm font-medium text-[var(--gold)] font-mono">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AppPopoverContent>
                  </AppPopover>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
                  Sizes
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppPopover>
                    <AppPopoverTrigger asChild>
                      <AppButton variant="outline" size="sm">
                        Small
                      </AppButton>
                    </AppPopoverTrigger>
                    <AppPopoverContent size="sm">
                      <div className="text-sm text-[var(--gray-50)]">Small popover content</div>
                    </AppPopoverContent>
                  </AppPopover>
                  <AppPopover>
                    <AppPopoverTrigger asChild>
                      <AppButton variant="outline" size="sm">
                        Medium
                      </AppButton>
                    </AppPopoverTrigger>
                    <AppPopoverContent size="md">
                      <div className="text-sm text-[var(--gray-50)]">
                        Medium popover content with more text
                      </div>
                    </AppPopoverContent>
                  </AppPopover>
                  <AppPopover>
                    <AppPopoverTrigger asChild>
                      <AppButton variant="outline" size="sm">
                        Large
                      </AppButton>
                    </AppPopoverTrigger>
                    <AppPopoverContent size="lg">
                      <div className="text-sm text-[var(--gray-50)]">
                        Large popover content with even more text and details
                      </div>
                    </AppPopoverContent>
                  </AppPopover>
                </div>
              </div>
            </div>
          </AppPanel>
        </div>
      </div>
    </div>
  )
}

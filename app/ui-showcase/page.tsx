"use client"

import { AppButton } from "@/components/app/app-button"
import { AppCard, AppCardContent, AppCardDescription, AppCardHeader, AppCardTitle } from "@/components/app/app-card"
import { AppInput } from "@/components/app/app-input"
import { AppBadge } from "@/components/app/app-badge"
import { AppSectionTitle } from "@/components/app/app-section-title"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { AppPanel } from "@/components/app/app-panel"
import { AppDivider } from "@/components/app/app-divider"

const TokenButton = ({ label }: { label: string }) => (
  <AppButton
    variant="outline"
    size="sm"
    className="rounded-full bg-[#0A0A0C] text-[#C9A227] border border-[#f5c76a80] px-4 py-2 text-[13px] shadow-[0_0_18px_rgba(201,162,39,0.12)] hover:bg-black/60"
  >
    {label}
  </AppButton>
)

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-50 to-zinc-100 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-600 shadow-sm backdrop-blur">
            Black & Gold DEX Theme
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-zinc-900">DEX Design System</h1>
            <p className="max-w-3xl text-sm text-zinc-600">
              High-contrast trading UI with bright gold accents, crisp black surfaces, and glassy inputs for a premium Web3 exchange experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton variant="primary">Primary Action</AppButton>
            <AppButton variant="secondary">Secondary</AppButton>
            <AppButton variant="outline">Ghost Outline</AppButton>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AppPanel variant="light" className="space-y-5">
            <AppSectionTitle withDivider>Buttons</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">Variants</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton variant="primary" size="sm">Primary</AppButton>
                  <AppButton variant="secondary" size="sm">Secondary</AppButton>
                  <AppButton variant="ghost" size="sm">Ghost</AppButton>
                  <AppButton variant="outline" size="sm">Outline</AppButton>
                  <AppButton variant="danger" size="sm">Danger</AppButton>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">Sizes</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Small</AppButton>
                  <AppButton size="md">Medium</AppButton>
                  <AppButton size="lg">Large</AppButton>
                </div>
              </div>
              <AppDivider className="bg-amber-200/60" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">States</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Default</AppButton>
                  <AppButton size="sm" loading>Loading</AppButton>
                  <AppButton size="sm" disabled>Disabled</AppButton>
                </div>
              </div>
            </div>
          </AppPanel>

          <AppPanel variant="light" className="space-y-5">
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

          <AppPanel variant="light" className="space-y-5">
            <AppSectionTitle withDivider>Badges & Chips</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">Variants</div>
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
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">Sizes</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppBadge size="sm" variant="primary">Small</AppBadge>
                  <AppBadge size="md" variant="primary">Medium</AppBadge>
                  <AppBadge size="lg" variant="primary">Large</AppBadge>
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

          <AppPanel variant="light" className="space-y-5">
            <AppSectionTitle withDivider>Cards</AppSectionTitle>
            <div className="grid gap-3 md:grid-cols-3">
              <AppCard variant="default">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-900">Default Card</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-500">Bright glass surface</AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-900">1.234 ETH</AppCardContent>
              </AppCard>
              <AppCard variant="bordered">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-900">Gold Border</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-500">Amber accent outline</AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-900">+$235.4</AppCardContent>
              </AppCard>
              <AppCard variant="elevated">
                <AppCardHeader className="gap-1">
                  <AppCardTitle className="text-sm text-zinc-900">Elevated</AppCardTitle>
                  <AppCardDescription className="text-xs text-zinc-500">Deeper shadow</AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="text-2xl font-semibold text-zinc-900">ROI 12.4%</AppCardContent>
              </AppCard>
            </div>
          </AppPanel>
        </div>

        <AppPanel variant="light" className="space-y-5">
          <AppSectionTitle withDivider>Typography</AppSectionTitle>
          <div className="space-y-2">
            <AppSectionTitle as="h1" className="text-zinc-900">Heading 1</AppSectionTitle>
            <AppSectionTitle as="h2" className="text-zinc-900">Heading 2</AppSectionTitle>
            <AppSectionTitle as="h3" className="text-zinc-900">Heading 3</AppSectionTitle>
            <div className="text-sm font-medium text-zinc-800">Body text on bright surfaces</div>
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
            <AppButton variant="ghost" size="sm" className="text-[#C9A227]">⚙️</AppButton>
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
              <AppButton variant="ghost" size="sm" className="h-10 w-10 rounded-full bg-black/40 text-[#C9A227] border border-[#C9A227]/30 hover:bg-black/50">
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
                borderImage: "linear-gradient(120deg, rgba(201,162,39,0.85), rgba(201,162,39,0.25)) 1",
              }}
            >
              Swap with Gold Glow
            </AppButton>
          </div>
        </AppPanel>
      </div>
    </div>
  )
}

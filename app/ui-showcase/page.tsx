"use client"

import { AppButton } from "@/components/app/app-button"
import { AppCard, AppCardContent, AppCardDescription, AppCardHeader, AppCardTitle } from "@/components/app/app-card"
import { AppInput } from "@/components/app/app-input"
import { AppBadge } from "@/components/app/app-badge"
import { AppSectionTitle } from "@/components/app/app-section-title"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { AppPanel } from "@/components/app/app-panel"
import { AppDivider } from "@/components/app/app-divider"

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground mb-1">Design System</h1>
          <p className="text-xs text-muted-foreground">
            Uniswap-style DEX UI Components
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Buttons */}
          <AppPanel>
            <AppSectionTitle className="mb-4">Buttons</AppSectionTitle>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">Variants</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton variant="primary" size="sm">Primary</AppButton>
                  <AppButton variant="secondary" size="sm">Secondary</AppButton>
                  <AppButton variant="ghost" size="sm">Ghost</AppButton>
                  <AppButton variant="danger" size="sm">Danger</AppButton>
                </div>
              </div>
              <AppDivider />
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">Sizes</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Small</AppButton>
                  <AppButton size="md">Medium</AppButton>
                  <AppButton size="lg">Large</AppButton>
                </div>
              </div>
              <AppDivider />
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">States</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppButton size="sm">Default</AppButton>
                  <AppButton size="sm" loading>Loading</AppButton>
                  <AppButton size="sm" disabled>Disabled</AppButton>
                </div>
              </div>
            </div>
          </AppPanel>

          {/* Inputs */}
          <AppPanel>
            <AppSectionTitle className="mb-4">Inputs</AppSectionTitle>
            <div className="space-y-3">
              <div>
                <AppFieldLabel>Default Input</AppFieldLabel>
                <AppInput placeholder="0.0" />
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

          {/* Badges */}
          <AppPanel>
            <AppSectionTitle className="mb-4">Badges</AppSectionTitle>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">Variants</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppBadge variant="default">Default</AppBadge>
                  <AppBadge variant="primary">Primary</AppBadge>
                  <AppBadge variant="success">Success</AppBadge>
                  <AppBadge variant="warning">Warning</AppBadge>
                  <AppBadge variant="error">Error</AppBadge>
                  <AppBadge variant="outline">Outline</AppBadge>
                </div>
              </div>
              <AppDivider />
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">Sizes</div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppBadge size="sm">Small</AppBadge>
                  <AppBadge size="md">Medium</AppBadge>
                  <AppBadge size="lg">Large</AppBadge>
                </div>
              </div>
            </div>
          </AppPanel>

          {/* Cards */}
          <AppPanel>
            <AppSectionTitle className="mb-4">Cards</AppSectionTitle>
            <div className="space-y-3">
              <AppCard variant="default" className="p-3">
                <div className="text-xs font-semibold mb-1">Default Card</div>
                <div className="text-xs text-muted-foreground">Glass effect with subtle shadow</div>
              </AppCard>
              <AppCard variant="bordered" className="p-3">
                <div className="text-xs font-semibold mb-1">Bordered Card</div>
                <div className="text-xs text-muted-foreground">Emphasized border</div>
              </AppCard>
              <AppCard variant="elevated" className="p-3">
                <div className="text-xs font-semibold mb-1">Elevated Card</div>
                <div className="text-xs text-muted-foreground">Stronger shadow</div>
              </AppCard>
            </div>
          </AppPanel>
        </div>

        {/* Typography */}
        <AppPanel className="mt-4">
          <AppSectionTitle className="mb-4">Typography</AppSectionTitle>
          <div className="space-y-2">
            <AppSectionTitle as="h1">Heading 1</AppSectionTitle>
            <AppSectionTitle as="h2">Heading 2</AppSectionTitle>
            <AppSectionTitle as="h3">Heading 3</AppSectionTitle>
            <div className="text-sm text-foreground font-medium">Body text</div>
            <div className="text-xs text-muted-foreground">Small text</div>
          </div>
        </AppPanel>

        {/* Form Example */}
        <AppPanel className="mt-4">
          <AppSectionTitle className="mb-4">Form Example</AppSectionTitle>
          <div className="space-y-3">
            <div>
              <AppFieldLabel>Amount</AppFieldLabel>
              <AppInput placeholder="0.0" />
            </div>
            <div className="flex items-center gap-2">
              <AppBadge variant="primary">ETH</AppBadge>
              <span className="text-muted-foreground text-xs">→</span>
              <AppBadge variant="primary">USDC</AppBadge>
            </div>
            <div className="flex gap-2">
              <AppButton variant="primary" className="flex-1">Swap</AppButton>
              <AppButton variant="secondary">Settings</AppButton>
            </div>
          </div>
        </AppPanel>

        {/* Swap Panel Example */}
        <AppCard variant="default" className="mt-4 p-5">
          <div className="flex items-center justify-between mb-4">
            <AppSectionTitle>Swap</AppSectionTitle>
            <AppButton variant="ghost" size="sm">⚙️</AppButton>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <AppFieldLabel className="mb-0">From</AppFieldLabel>
                <span className="text-xs text-muted-foreground">Balance: 1.234</span>
              </div>
              <div className="flex gap-2">
                <AppInput className="flex-1" placeholder="0.0" />
                <AppButton variant="secondary" size="sm">ETH</AppButton>
              </div>
            </div>
            <div className="flex justify-center -my-1">
              <AppButton variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">⇅</AppButton>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <AppFieldLabel className="mb-0">To</AppFieldLabel>
                <span className="text-xs text-muted-foreground">Balance: 0.0</span>
              </div>
              <div className="flex gap-2">
                <AppInput className="flex-1" placeholder="0.0" />
                <AppButton variant="secondary" size="sm">USDC</AppButton>
              </div>
            </div>
            <AppButton variant="primary" className="w-full mt-2">Swap</AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  )
}

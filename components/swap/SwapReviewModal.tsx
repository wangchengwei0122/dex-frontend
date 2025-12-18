"use client"

import { AppDialog, AppDialogContent } from "@/components/app/app-dialog"
import { AppButton } from "@/components/app/app-button"
import { TokenIcon } from "@/components/shared/token-icon"
import type { SwapReviewParams } from "@/features/swap/engine"

export interface SwapReviewModalProps {
  open: boolean
  params: SwapReviewParams | null
  priceImpactPercent?: number
  deadlineMinutes?: number
  isSubmitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SwapReviewModal({
  open,
  params,
  priceImpactPercent,
  deadlineMinutes,
  isSubmitting = false,
  onClose,
  onConfirm,
}: SwapReviewModalProps) {
  const formatSlippage = (bps: number) => (bps / 100).toFixed(2)

  const formatPriceImpact = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) return "—"
    if (value < 0.01) return "< 0.01%"
    return `${value.toFixed(2)}%`
  }

  return (
    <AppDialog open={open} onOpenChange={onClose}>
      <AppDialogContent title="Review Swap" size="md">
        <div className="space-y-5">
          {params ? (
            <>
              <div className="rounded-2xl border border-[color:var(--panel-border-dark)] bg-black/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TokenIcon
                      symbol={params.fromToken.symbol}
                      name={params.fromToken.name}
                      logoURI={params.fromToken.logoURI}
                      size={32}
                    />
                    <div>
                      <div className="text-xs uppercase tracking-wide text-zinc-400">From</div>
                      <div className="text-base font-semibold text-white">
                        {params.fromToken.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">Amount</div>
                    <div className="text-base font-semibold text-white">
                      {params.humanAmountIn}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TokenIcon
                      symbol={params.toToken.symbol}
                      name={params.toToken.name}
                      logoURI={params.toToken.logoURI}
                      size={32}
                    />
                    <div>
                      <div className="text-xs uppercase tracking-wide text-zinc-400">To</div>
                      <div className="text-base font-semibold text-white">
                        {params.toToken.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">Expected</div>
                    <div className="text-base font-semibold text-white">
                      {params.humanAmountOut}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-[color:var(--panel-border-dark)] bg-black/20 px-4 py-3 text-sm">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Minimum received</span>
                  <span className="text-white">
                    {params.humanAmountOutMin} {params.toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Slippage</span>
                  <span className="text-white">{formatSlippage(params.slippageBps)}%</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Price impact</span>
                  <span className="text-white">{formatPriceImpact(priceImpactPercent)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Deadline</span>
                  <span className="text-white">
                    {deadlineMinutes ?? params.deadlineMinutes} min
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-[color:var(--panel-border-dark)] bg-black/30 p-4 text-sm text-zinc-400">
              No quote available for review.
            </div>
          )}

          <div className="flex items-center gap-3">
            <AppButton
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Back
            </AppButton>
            <AppButton
              variant="primary"
              className="flex-1"
              onClick={onConfirm}
              loading={isSubmitting}
              disabled={!params}
            >
              Confirm Swap
            </AppButton>
          </div>
        </div>
      </AppDialogContent>
    </AppDialog>
  )
}

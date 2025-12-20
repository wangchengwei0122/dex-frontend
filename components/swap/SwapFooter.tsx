import { Loader2 } from "lucide-react"
import type { SwapReviewParams, Token } from "@/features/swap/engine"

export interface SwapFooterProps {
  toToken?: Token | null
  rateText?: string
  slippageBps: number
  reviewParams?: SwapReviewParams | null
  priceImpactPercent?: number
  /** 是否正在获取报价 */
  isLoadingQuote?: boolean
  /** 报价错误信息 */
  quoteError?: string
}

export function SwapFooter({
  rateText,
  slippageBps,
  reviewParams,
  priceImpactPercent,
  toToken,
  isLoadingQuote,
  quoteError,
}: SwapFooterProps) {
  const formatSlippage = (bps: number) => {
    return (bps / 100).toFixed(2)
  }

  // 渲染价格信息
  const renderRateInfo = () => {
    if (isLoadingQuote) {
      return (
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Fetching quote...</span>
        </span>
      )
    }

    if (quoteError) {
      return <span className="text-[var(--error-text)]">{quoteError}</span>
    }

    return <span className="text-zinc-400">{rateText || ""}</span>
  }

  const renderQuoteDetails = () => {
    if (!reviewParams || !toToken) {
      return <span className="text-[11px] text-zinc-500"></span>
    }

    return (
      <div className="flex flex-col gap-1 text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>Expected output</span>
          <span className="text-white">
            {reviewParams.humanAmountOut} {toToken.symbol}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Minimum received</span>
          <span className="text-white">
            {reviewParams.humanAmountOutMin} {toToken.symbol}
          </span>
        </div>
      </div>
    )
  }

  const renderPriceImpact = () => {
    if (typeof priceImpactPercent !== "number" || Number.isNaN(priceImpactPercent)) {
      return null
    }

    const displayValue = priceImpactPercent < 0.01 ? "< 0.01" : priceImpactPercent.toFixed(2)
    const highImpact = priceImpactPercent > 5

    return (
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">Price impact</span>
        <span className={highImpact ? "text-red-500" : "text-zinc-300"}>-{displayValue}%</span>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-[11px]">
      <div className="flex items-center justify-between">
        {renderRateInfo()}
        <span className="text-zinc-400">Slippage {formatSlippage(slippageBps)}%</span>
      </div>
      {renderQuoteDetails()}
      {renderPriceImpact()}
    </div>
  )
}

import { Loader2 } from "lucide-react"
import type { Token } from "@/features/swap/engine"

export interface SwapFooterProps {
  fromToken?: Token | null;
  toToken?: Token | null;
  rateText?: string;
  slippageBps: number;
  /** 是否正在获取报价 */
  isLoadingQuote?: boolean;
  /** 报价错误信息 */
  quoteError?: string;
}

export function SwapFooter({ 
  rateText, 
  slippageBps,
  isLoadingQuote,
  quoteError,
}: SwapFooterProps) {
  const formatSlippage = (bps: number) => {
    return (bps / 100).toFixed(2);
  };

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
      return (
        <span className="text-[var(--error-text)]">
          {quoteError}
        </span>
      )
    }

    return (
      <span className="text-zinc-400">
        {rateText || '—'}
      </span>
    )
  }

  return (
    <div className="flex items-center justify-between text-[11px]">
      {renderRateInfo()}
      <span className="text-zinc-400">Slippage {formatSlippage(slippageBps)}%</span>
    </div>
  )
}

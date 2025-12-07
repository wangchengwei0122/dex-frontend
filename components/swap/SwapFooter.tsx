import type { Token } from "./types"

export interface SwapFooterProps {
  fromToken?: Token | null;
  toToken?: Token | null;
  rateText?: string;
  slippageBps: number;
}

export function SwapFooter({ rateText, slippageBps }: SwapFooterProps) {
  const formatSlippage = (bps: number) => {
    return (bps / 100).toFixed(2);
  };

  return (
    <div className="flex items-center justify-between text-[11px] text-zinc-400">
      <span>{rateText || '—'}</span>
      <span>Slippage {formatSlippage(slippageBps)}%</span>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useChainId, useConnections } from "wagmi"
import { AppPanel } from "@/components/app/app-panel"
import { SwapHeader } from "./SwapHeader"
import { SwapTokenRow } from "./SwapTokenRow"
import { SwapDirectionSwitch } from "./SwapDirectionSwitch"
import { SwapFooter } from "./SwapFooter"
import { SwapActionButton } from "./SwapActionButton"
import { TokenSelectDialog } from "./TokenSelectDialog"
import { SwapSettingsDialog } from "./SwapSettingsDialog"
import { useSwapQuote } from "@/lib/hooks/useSwapQuote"
import type { Token, Side, SwapSettings, SwapReviewParams } from "./types"

// Mock 数据
const MOCK_TOKENS: Token[] = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
  },
]

const MOCK_BALANCES: Record<string, number> = {
  ETH: 1.234,
  USDC: 5000.0,
  USDT: 2500.0,
  WBTC: 0.05,
}

const MOCK_RATES: Record<string, Record<string, number>> = {
  ETH: {
    USDC: 3524.5,
    USDT: 3524.5,
    WBTC: 0.055,
  },
  USDC: {
    ETH: 1 / 3524.5,
    USDT: 1.0,
    WBTC: 0.0000156,
  },
  USDT: {
    ETH: 1 / 3524.5,
    USDC: 1.0,
    WBTC: 0.0000156,
  },
  WBTC: {
    ETH: 1 / 0.055,
    USDC: 64090.0,
    USDT: 64090.0,
  },
}

export interface SwapCardProps {
  tokens?: Token[]
  defaultFromSymbol?: string
  defaultToSymbol?: string
  onReview?: (params: SwapReviewParams) => void
}

export function SwapCard({
  tokens = MOCK_TOKENS,
  defaultFromSymbol = "ETH",
  defaultToSymbol = "USDC",
  onReview,
}: SwapCardProps) {
  // Wagmi hooks
  const chainId = useChainId()
  const connections = useConnections()
  const isConnected = connections.length > 0

  // State
  const [fromToken, setFromToken] = useState<Token | null>(
    tokens.find((t) => t.symbol === defaultFromSymbol) || null
  )
  const [toToken, setToToken] = useState<Token | null>(
    tokens.find((t) => t.symbol === defaultToSymbol) || null
  )
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [balances] = useState(MOCK_BALANCES)
  const [settings, setSettings] = useState<SwapSettings>({
    slippageBps: 30,
    deadlineMinutes: 30,
    oneClickEnabled: false,
  })
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false)
  const [tokenDialogSide, setTokenDialogSide] = useState<Side | null>(null)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  // 链上报价
  const {
    amountOutFormatted,
    isLoading: isLoadingQuote,
    isFetching: isFetchingQuote,
    error: quoteError,
  } = useSwapQuote({
    fromToken,
    toToken,
    amountIn: fromAmount,
    chainId,
    enabled: isConnected, // 只有在连接钱包后才启用报价
  })

  // 使用链上报价更新 toAmount
  useEffect(() => {
    if (amountOutFormatted) {
      setToAmount(amountOutFormatted)
    } else if (!fromAmount || !fromToken || !toToken) {
      setToAmount("")
    }
  }, [amountOutFormatted, fromAmount, fromToken, toToken])

  // Handlers
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
  }

  const handleOpenTokenDialog = (side: Side) => {
    setTokenDialogSide(side)
    setTokenDialogOpen(true)
  }

  const handleSelectToken = (side: Side, token: Token) => {
    if (side === "from") {
      setFromToken(token)
      // If same as toToken, clear toToken
      if (toToken?.address === token.address) {
        setToToken(null)
      }
    } else {
      setToToken(token)
      // If same as fromToken, clear fromToken
      if (fromToken?.address === token.address) {
        setFromToken(null)
      }
    }
  }

  const handleSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    // 切换方向时清空金额，让用户重新输入
    setFromAmount("")
    setToAmount("")
  }

  const handleReview = () => {
    if (!fromToken || !toToken || !fromAmount) return

    const params: SwapReviewParams = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      settings,
    }

    console.log("Swap Review Params:", params)
    onReview?.(params)
  }

  // Button state logic
  const getButtonState = () => {
    if (!isConnected) {
      return { canSubmit: false, errorMessage: undefined }
    }

    if (!fromToken || !toToken) {
      return { canSubmit: false, errorMessage: "Select tokens" }
    }

    if (!fromAmount || fromAmount === "0") {
      return { canSubmit: false, errorMessage: "Enter an amount" }
    }

    const fromAmountNum = Number(fromAmount)
    if (isNaN(fromAmountNum)) {
      return { canSubmit: false, errorMessage: "Invalid amount" }
    }

    const balance = balances[fromToken.symbol] || 0
    if (fromAmountNum > balance) {
      return { canSubmit: false, errorMessage: "Insufficient balance" }
    }

    // 报价加载中
    if (isLoadingQuote || isFetchingQuote) {
      return { canSubmit: false, errorMessage: undefined }
    }

    // 报价错误
    if (quoteError) {
      return { canSubmit: false, errorMessage: quoteError.message }
    }

    // 没有报价结果
    if (!toAmount || toAmount === "0") {
      return { canSubmit: false, errorMessage: "No quote available" }
    }

    return { canSubmit: true, errorMessage: undefined }
  }

  const { canSubmit, errorMessage } = getButtonState()

  // Rate text - 基于实际报价计算
  const getRateText = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) {
      return undefined
    }

    const fromAmountNum = Number(fromAmount)
    const toAmountNum = Number(toAmount)

    if (fromAmountNum > 0 && toAmountNum > 0) {
      const rate = toAmountNum / fromAmountNum
      return `1 ${fromToken.symbol} ≈ ${rate.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      })} ${toToken.symbol}`
    }

    return undefined
  }

  return (
    <>
      <AppPanel variant="dark" className="space-y-6">
        <SwapHeader onOpenSettings={() => setSettingsDialogOpen(true)} />

        <div className="space-y-4">
          <SwapTokenRow
            side="from"
            label="From"
            token={fromToken}
            amount={fromAmount}
            balance={fromToken ? balances[fromToken.symbol] : undefined}
            onAmountChange={handleFromAmountChange}
            onClickToken={() => handleOpenTokenDialog("from")}
          />

          <SwapDirectionSwitch onSwitch={handleSwitch} />

          <SwapTokenRow
            side="to"
            label="To"
            token={toToken}
            amount={toAmount}
            balance={toToken ? balances[toToken.symbol] : undefined}
            readOnlyAmount={true}
            onClickToken={() => handleOpenTokenDialog("to")}
          />

          <SwapFooter
            fromToken={fromToken}
            toToken={toToken}
            rateText={getRateText()}
            slippageBps={settings.slippageBps}
            isLoadingQuote={isFetchingQuote}
            quoteError={quoteError?.message}
          />

          <SwapActionButton
            isConnected={isConnected}
            canSubmit={canSubmit}
            errorMessage={errorMessage}
            onConnect={() => {}} // 使用 wagmi 的连接状态，这里不需要手动处理
            onReview={handleReview}
          />
        </div>
      </AppPanel>

      <TokenSelectDialog
        open={tokenDialogOpen}
        side={tokenDialogSide || "from"}
        tokens={tokens}
        selectedToken={tokenDialogSide === "from" ? fromToken : toToken}
        onClose={() => setTokenDialogOpen(false)}
        onSelectToken={handleSelectToken}
      />

      <SwapSettingsDialog
        open={settingsDialogOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </>
  )
}

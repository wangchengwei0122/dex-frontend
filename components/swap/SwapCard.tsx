"use client"

import { useState, useEffect, useMemo } from "react"
import { useChainId, useConnections, useConnection } from "wagmi"
import { parseUnits } from "viem"
import { AppPanel } from "@/components/app/app-panel"
import { SwapHeader } from "./SwapHeader"
import { SwapTokenRow } from "./SwapTokenRow"
import { SwapDirectionSwitch } from "./SwapDirectionSwitch"
import { SwapFooter } from "./SwapFooter"
import { SwapActionButton } from "./SwapActionButton"
import { TokenSelectDialog } from "./TokenSelectDialog"
import { SwapSettingsDialog } from "./SwapSettingsDialog"
import { useSwapQuote } from "@/lib/hooks/useSwapQuote"
import { useTokenBalances } from "@/lib/hooks/useTokenBalances"
import { useTokenAllowance } from "@/lib/hooks/useTokenAllowance"
import { useTokenApproval } from "@/lib/hooks/useTokenApproval"
import { getTokensByChainId, tokenConfigToToken } from "@/config/tokens"
import { getUniswapV2RouterAddress } from "@/config/contracts"
import type { Token, Side, SwapSettings, SwapReviewParams } from "./types"
import type { TokenConfig } from "@/config/tokens"

export interface SwapCardProps {
  tokens?: Token[]
  defaultFromSymbol?: string
  defaultToSymbol?: string
  onReview?: (params: SwapReviewParams) => void
}

export function SwapCard({
  tokens: propTokens,
  defaultFromSymbol = "ETH",
  defaultToSymbol = "USDC",
  onReview,
}: SwapCardProps) {
  // Wagmi hooks
  const chainId = useChainId()
  const connections = useConnections()
  const isConnected = connections.length > 0
  const { address } = useConnection()

  // 获取当前链的 token 配置
  const tokenConfigs = useMemo(() => getTokensByChainId(chainId), [chainId])

  // 转换为组件使用的 Token 类型
  const tokens = useMemo(
    () => propTokens || tokenConfigs.map(tokenConfigToToken),
    [propTokens, tokenConfigs]
  )

  // 获取真实余额
  const { data: balances, isLoading: balancesLoading } = useTokenBalances({
    tokens: tokenConfigs,
  })

  // 计算默认 token
  const defaultFromToken = useMemo(() => {
    return tokens.find((t) => t.symbol === defaultFromSymbol) || tokens[0] || null
  }, [tokens, defaultFromSymbol])

  const defaultToToken = useMemo(() => {
    const to = tokens.find((t) => t.symbol === defaultToSymbol) || tokens[1] || tokens[0] || null
    return to && to.address !== defaultFromToken?.address ? to : null
  }, [tokens, defaultToSymbol, defaultFromToken])

  // State - 使用函数初始化，只在首次渲染时设置
  const [fromToken, setFromToken] = useState<Token | null>(() => defaultFromToken)
  const [toToken, setToToken] = useState<Token | null>(() => defaultToToken)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [settings, setSettings] = useState<SwapSettings>({
    slippageBps: 30,
    deadlineMinutes: 30,
    oneClickEnabled: false,
  })
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false)
  const [tokenDialogSide, setTokenDialogSide] = useState<Side | null>(null)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  // 当 tokens 或 chainId 变化时，如果当前 token 不在新列表中，重置为默认值
  useEffect(() => {
    if (tokens.length > 0) {
      const fromTokenExists = fromToken && tokens.some((t) => t.address === fromToken.address)
      const toTokenExists = toToken && tokens.some((t) => t.address === toToken.address)

      if (!fromTokenExists) {
        setFromToken(defaultFromToken)
      }
      if (!toTokenExists) {
        setToToken(defaultToToken)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, tokens.length]) // 只在 chainId 或 token 数量变化时更新

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

  // 派生 toAmount - 优先使用链上报价
  const displayToAmount = useMemo(() => {
    if (amountOutFormatted) {
      return amountOutFormatted
    }
    if (!fromAmount || !fromToken || !toToken) {
      return ""
    }
    return toAmount
  }, [amountOutFormatted, fromAmount, fromToken, toToken, toAmount])

  // 获取 Router 地址
  const routerAddress = useMemo(() => {
    return getUniswapV2RouterAddress(chainId)
  }, [chainId])

  // 获取 fromToken 对应的 TokenConfig
  const fromTokenConfig = useMemo<TokenConfig | null>(() => {
    if (!fromToken) return null
    return tokenConfigs.find((config) => config.address === fromToken.address) || null
  }, [fromToken, tokenConfigs])

  // 获取 Token Allowance
  const {
    allowance,
    isLoading: allowanceLoading,
    refetch: refetchAllowance,
  } = useTokenAllowance({
    token: fromTokenConfig,
    owner: address,
    spender: routerAddress,
    chainId,
    enabled: Boolean(fromTokenConfig && address && routerAddress && isConnected),
  })

  // Token Approval Hook
  const {
    approveMax,
    isPending: approvePending,
    isSuccess: approveSuccess,
    isError: approveError,
    error: approveErrorObj,
  } = useTokenApproval({
    token: fromTokenConfig,
    owner: address,
    spender: routerAddress,
    chainId,
  })

  // 在 Approve 成功后刷新 allowance
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance()
    }
  }, [approveSuccess, refetchAllowance])

  // 计算 fromAmount 的 bigint 值（用于比较 allowance）
  const fromAmountInWei = useMemo(() => {
    if (!fromToken || !fromAmount || fromAmount === "0") {
      return 0n
    }
    try {
      const amountNum = Number(fromAmount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return 0n
      }
      return parseUnits(fromAmount, fromToken.decimals)
    } catch {
      return 0n
    }
  }, [fromToken, fromAmount])

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
      toAmount: displayToAmount,
      settings,
    }

    console.log("Swap Review Params:", params)
    onReview?.(params)
  }

  // 决定当前按钮的主要操作
  const primaryAction = useMemo(() => {
    // Case 1: 钱包未连接
    if (!isConnected) {
      return {
        label: "Connect Wallet",
        disabled: false,
        onClick: () => {}, // 使用 wagmi 的连接状态，这里不需要手动处理
        type: "connect" as const,
      }
    }

    // Case 2: 基础校验
    if (!fromToken || !toToken) {
      return {
        label: "Select tokens",
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    if (!fromAmount || fromAmount === "0") {
      return {
        label: "Enter an amount",
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    const fromAmountNum = Number(fromAmount)
    if (isNaN(fromAmountNum)) {
      return {
        label: "Invalid amount",
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    // 使用真实余额检查
    const balanceStr = balances[fromToken.address] || "0"
    const balance = Number(balanceStr)
    if (isNaN(balance) || fromAmountNum > balance) {
      return {
        label: "Insufficient balance",
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    // Case 3: 原生币不需要 approve，直接走 Swap
    if (fromTokenConfig?.isNative) {
      // 报价加载中
      if (isLoadingQuote || isFetchingQuote) {
        return {
          label: "Loading...",
          disabled: true,
          onClick: () => {},
          type: "loading" as const,
        }
      }

      // 报价错误
      if (quoteError) {
        return {
          label: quoteError.message,
          disabled: true,
          onClick: () => {},
          type: "error" as const,
        }
      }

      // 没有报价结果
      if (!displayToAmount || displayToAmount === "0") {
        return {
          label: "No quote available",
          disabled: true,
          onClick: () => {},
          type: "error" as const,
        }
      }

      return {
        label: "Swap",
        disabled: false,
        onClick: handleReview,
        type: "swap" as const,
      }
    }

    // Case 4: ERC20 Token，需要检查 allowance
    // 检查 allowance 加载中
    if (allowanceLoading) {
      return {
        label: "Checking allowance...",
        disabled: true,
        onClick: () => {},
        type: "loading" as const,
      }
    }

    // Approve 进行中
    if (approvePending) {
      return {
        label: "Approving...",
        disabled: true,
        onClick: () => {},
        type: "approving" as const,
      }
    }

    // 如果 allowance 不足，显示 Approve 按钮
    if (allowance < fromAmountInWei) {
      return {
        label: `Approve ${fromToken.symbol}`,
        disabled: false,
        onClick: async () => {
          try {
            await approveMax()
          } catch (err) {
            // 错误已经在 hook 中处理
            console.error("Approve failed:", err)
          }
        },
        type: "approve" as const,
      }
    }

    // Allowance 充足，可以 Swap
    // 报价加载中
    if (isLoadingQuote || isFetchingQuote) {
      return {
        label: "Loading...",
        disabled: true,
        onClick: () => {},
        type: "loading" as const,
      }
    }

    // 报价错误
    if (quoteError) {
      return {
        label: quoteError.message,
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    // 没有报价结果
    if (!displayToAmount || displayToAmount === "0") {
      return {
        label: "No quote available",
        disabled: true,
        onClick: () => {},
        type: "error" as const,
      }
    }

    return {
      label: "Swap",
      disabled: false,
      onClick: handleReview,
      type: "swap" as const,
    }
  }, [
    isConnected,
    fromToken,
    toToken,
    fromAmount,
    balances,
    fromTokenConfig,
    allowanceLoading,
    allowance,
    fromAmountInWei,
    approvePending,
    isLoadingQuote,
    isFetchingQuote,
    quoteError,
    displayToAmount,
    approveMax,
    handleReview,
  ])

  // 兼容旧的按钮状态逻辑（用于错误显示）
  const errorMessage = useMemo(() => {
    if (primaryAction.type === "error") {
      return primaryAction.label
    }
    if (approveError && approveErrorObj) {
      return `Approve failed: ${approveErrorObj.message}`
    }
    return undefined
  }, [primaryAction, approveError, approveErrorObj])

  // Rate text - 基于实际报价计算
  const getRateText = () => {
    if (!fromToken || !toToken || !fromAmount || !displayToAmount) {
      return undefined
    }

    const fromAmountNum = Number(fromAmount)
    const toAmountNum = Number(displayToAmount)

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
            balance={
              fromToken && balances[fromToken.address]
                ? Number(balances[fromToken.address])
                : balancesLoading
                  ? undefined
                  : 0
            }
            onAmountChange={handleFromAmountChange}
            onClickToken={() => handleOpenTokenDialog("from")}
          />

          <SwapDirectionSwitch onSwitch={handleSwitch} />

          <SwapTokenRow
            side="to"
            label="To"
            token={toToken}
            amount={displayToAmount}
            balance={
              toToken && balances[toToken.address]
                ? Number(balances[toToken.address])
                : balancesLoading
                  ? undefined
                  : 0
            }
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
            canSubmit={primaryAction.type === "swap" || primaryAction.type === "approve"}
            errorMessage={errorMessage}
            loading={primaryAction.type === "loading" || primaryAction.type === "approving"}
            buttonLabel={primaryAction.label}
            onConnect={() => {}} // 使用 wagmi 的连接状态，这里不需要手动处理
            onReview={primaryAction.onClick}
          />

          {/* Approve 错误提示 */}
          {approveError && approveErrorObj && (
            <div className="text-sm text-error-foreground text-center mt-2">
              Approve failed: {approveErrorObj.message}
            </div>
          )}
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

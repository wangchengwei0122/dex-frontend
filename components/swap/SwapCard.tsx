"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useChainId, useSwitchChain } from "wagmi"
import { AppPanel } from "@/components/app/app-panel"
import { SwapHeader } from "./SwapHeader"
import { TokenAmountInput } from "./TokenAmountInput"
import { SwapDirectionSwitch } from "./SwapDirectionSwitch"
import { SwapFooter } from "./SwapFooter"
import { SwapActionButton } from "./SwapActionButton"
import { TokenSelectDialog } from "./TokenSelectDialog"
import { SwapSettingsDialog } from "./SwapSettingsDialog"
import { RecentSwaps } from "./RecentSwaps"
import { useTokenBalances } from "@/lib/hooks/useTokenBalances"
import { getTokensByChainId } from "@/config/tokens"
import { getDexChainConfig, PREFERRED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "@/config/chains"
import { getExplorerTxUrl } from "@/lib/utils"
import { formatUnits, parseUnits } from "viem"
import {
  deriveSwapError,
  useSwapForm,
  useTokenAllowance,
  useTokenApproval,
  useSwap,
  type Side,
  type SwapError,
  type SwapReviewParams,
  type Token,
} from "@/features/swap/engine"
import {
  type RecentSwap,
  addRecentSwap,
  getRecentSwapsForAccount,
  updateRecentSwapStatus,
} from "@/features/swap/recentSwaps"
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
  const chainIdFromWagmi = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const dexChainConfig = useMemo(() => getDexChainConfig(chainIdFromWagmi), [chainIdFromWagmi])
  const isSupportedChain = Boolean(dexChainConfig)
  const recommendedChain = getDexChainConfig(PREFERRED_CHAIN_ID)

  const tokenConfigs = useMemo(
    () => (isSupportedChain ? getTokensByChainId(chainIdFromWagmi) : []),
    [chainIdFromWagmi, isSupportedChain]
  )
  const tokens = useMemo(
    () => (isSupportedChain ? propTokens || tokenConfigs : []),
    [isSupportedChain, propTokens, tokenConfigs]
  )
  const supportedNetworkLabel = useMemo(
    () =>
      SUPPORTED_CHAIN_IDS.map(
        (id) => getDexChainConfig(id)?.name || `Chain ${id}`
      ).join(" or "),
    []
  )

  const { data: balances, isLoading: balancesLoading } = useTokenBalances({
    tokens,
  })

  const defaultFromToken = useMemo(() => {
    if (!tokens.length) return null
    return (
      tokens.find((t) => t.symbol === defaultFromSymbol && t.chainId === chainIdFromWagmi) ||
      tokens.find((t) => t.isNative) ||
      tokens[0] ||
      null
    )
  }, [tokens, defaultFromSymbol, chainIdFromWagmi])

  const defaultToToken = useMemo(() => {
    if (!tokens.length) return null

    const toBySymbol = tokens.find(
      (t) => t.symbol === defaultToSymbol && t.address !== defaultFromToken?.address
    )
    if (toBySymbol) return toBySymbol

    const stable =
      tokens.find((t) => t.isStable && t.address !== defaultFromToken?.address) ||
      tokens.find((t) => t.address !== defaultFromToken?.address)
    return stable || null
  }, [tokens, defaultToSymbol, defaultFromToken])

  const getBalanceLabel = useCallback(
    (token?: TokenConfig | null) => {
      if (!token) return undefined
      const value = balances[token.address]
      if (value === undefined) {
        return balancesLoading ? undefined : "0.0"
      }
      const num = Number(value)
      return Number.isNaN(num) ? value : num.toFixed(4)
    },
    [balances, balancesLoading]
  )

  const [tokenDialogOpen, setTokenDialogOpen] = useState(false)
  const [tokenDialogSide, setTokenDialogSide] = useState<Side | null>(null)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippageBps,
    deadlineMinutes,
    chainId,
    address,
    reviewParams,
    priceImpactPercent,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    switchTokens,
    setSlippageBps,
    setDeadlineMinutes,
    isConnected,
    isLoadingQuote,
    isFetchingQuote,
    quoteError,
    settings,
    setSettings,
  } = useSwapForm({
    tokens,
    defaultFromToken,
    defaultToToken,
  })

  const routerAddress = dexChainConfig?.routerAddress

  const fromTokenConfig = fromToken || null
  const toTokenConfig = toToken || null

  const {
    allowance,
    isLoading: allowanceLoading,
    refetch: refetchAllowance,
  } = useTokenAllowance({
    token: fromTokenConfig,
    owner: address,
    spender: routerAddress,
    chainId,
    enabled: Boolean(fromTokenConfig && address && routerAddress && isConnected && isSupportedChain),
  })

  const {
    approveMax,
    isPending: approvePending,
    isSuccess: approveSuccess,
  } = useTokenApproval({
    token: fromTokenConfig,
    owner: address,
    spender: routerAddress,
    chainId,
  })

  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance()
    }
  }, [approveSuccess, refetchAllowance])

  const amountInWei = useMemo(() => {
    if (reviewParams?.amountIn) return reviewParams.amountIn
    if (!fromToken || !fromAmount) return undefined
    try {
      const amountNum = Number(fromAmount)
      if (Number.isNaN(amountNum) || amountNum <= 0) return undefined
      return parseUnits(fromAmount, fromToken.decimals)
    } catch {
      return undefined
    }
  }, [fromAmount, fromToken, reviewParams?.amountIn])

  const amountOutMin = useMemo(() => {
    if (!reviewParams) return "0"
    return formatUnits(reviewParams.amountOutMin, reviewParams.toToken.decimals)
  }, [reviewParams])

  const {
    swap,
    status: swapStatus,
    isSuccess: swapSuccess,
    txHash: swapTxHash,
    error: swapErrorObj,
  } = useSwap({
    fromToken: fromTokenConfig,
    toToken: toTokenConfig,
    amountIn: reviewParams?.humanAmountIn ?? "",
    amountOutMin,
    recipient: reviewParams?.recipient,
    deadlineMinutes,
    chainId,
  })

  const [recentSwaps, setRecentSwaps] = useState<RecentSwap[]>([])
  const pendingSwapIdRef = useRef<string | null>(null)

  const refreshRecentSwaps = useCallback(() => {
    if (!chainId) {
      setRecentSwaps([])
      return
    }
    setRecentSwaps(getRecentSwapsForAccount(chainId, address))
  }, [address, chainId])

  useEffect(() => {
    refreshRecentSwaps()
  }, [refreshRecentSwaps])

  const fromBalanceWei = useMemo(() => {
    if (!fromToken) return undefined
    const balanceStr = balances[fromToken.address]
    if (balanceStr === undefined) return undefined
    try {
      return parseUnits(balanceStr, fromToken.decimals)
    } catch {
      return undefined
    }
  }, [balances, fromToken])

  useEffect(() => {
    if (swapSuccess) {
      // 保持输入值，让用户看到结果
    }
  }, [swapSuccess])

  useEffect(() => {
    const pendingId = pendingSwapIdRef.current
    if (!pendingId) return

    if (swapStatus === "pending" && swapTxHash) {
      updateRecentSwapStatus(pendingId, "pending", swapTxHash)
      refreshRecentSwaps()
    }

    if (swapStatus === "success" || swapStatus === "error") {
      updateRecentSwapStatus(pendingId, swapStatus, swapTxHash)
      refreshRecentSwaps()
      pendingSwapIdRef.current = null
    }
  }, [refreshRecentSwaps, swapStatus, swapTxHash])

  const explorerUrl = useMemo(() => {
    if (swapSuccess && swapTxHash && chainId) {
      return getExplorerTxUrl(chainId, swapTxHash)
    }
    return undefined
  }, [swapSuccess, swapTxHash, chainId])

  const currentError: SwapError = useMemo(() => {
    const isNativeFromToken = Boolean(fromTokenConfig?.isNative)
    return deriveSwapError({
      isConnected,
      chainId,
      supportedChainIds: SUPPORTED_CHAIN_IDS,
      fromToken: fromTokenConfig,
      toToken: toTokenConfig,
      fromAmount,
      toAmount,
      fromBalance: fromBalanceWei,
      quoteLoading: isLoadingQuote || isFetchingQuote,
      quoteError,
      isNativeFromToken,
      allowance,
      amountInWei,
      allowanceLoading,
      swapStatus: swapStatus || "idle",
      swapError: swapErrorObj,
    })
  }, [
    allowance,
    allowanceLoading,
    chainId,
    fromAmount,
    fromBalanceWei,
    fromTokenConfig,
    isConnected,
    isFetchingQuote,
    isLoadingQuote,
    amountInWei,
    quoteError,
    swapErrorObj,
    swapStatus,
    toAmount,
    toTokenConfig,
  ])

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
  }

  const handleOpenTokenDialog = (side: Side) => {
    setTokenDialogSide(side)
    setTokenDialogOpen(true)
  }

  const handleSelectToken = (side: Side, token: TokenConfig) => {
    if (side === "from") {
      setFromToken(token)
      if (toToken?.address === token.address) {
        setToToken(null)
      }
    } else {
      setToToken(token)
      if (fromToken?.address === token.address) {
        setFromToken(null)
      }
    }
  }

  const handleSwitch = () => {
    switchTokens()
  }

  const handleReview = useCallback(() => {
    if (!reviewParams) return

    console.log("Swap Review Params:", reviewParams)
    onReview?.(reviewParams)
  }, [onReview, reviewParams])

  const handleSwap = useCallback(async () => {
    if (!reviewParams || !address || !chainId) {
      await swap()
      return
    }

    const id = `${chainId}-${Date.now()}-${reviewParams.fromToken.symbol}-${reviewParams.toToken.symbol}`
    pendingSwapIdRef.current = id
    addRecentSwap({
      id,
      chainId,
      account: address,
      timestamp: Date.now(),
      txHash: undefined,
      fromTokenSymbol: reviewParams.fromToken.symbol,
      toTokenSymbol: reviewParams.toToken.symbol,
      fromAmount: reviewParams.humanAmountIn,
      toAmount: reviewParams.humanAmountOut,
      status: "pending",
    })
    refreshRecentSwaps()

    try {
      await swap()
    } catch (err) {
      console.error("Swap failed:", err)
    }
  }, [address, chainId, refreshRecentSwaps, reviewParams, swap])

  const primaryAction = useMemo(() => {
    if (!isConnected) {
      return {
        label: "Connect Wallet",
        disabled: false,
        loading: false,
        onClick: () => {},
        type: "connect" as const,
      }
    }

    if (!isSupportedChain) {
      const targetChainId = recommendedChain?.chainId ?? SUPPORTED_CHAIN_IDS[0]
      const label = recommendedChain ? `Switch to ${recommendedChain.name}` : "Switch network"
      return {
        label,
        disabled: !switchChain,
        loading: isSwitchingChain,
        onClick: () => {
          if (switchChain) {
            switchChain({ chainId: targetChainId })
          }
        },
        type: "network" as const,
      }
    }

    if (approvePending) {
      return {
        label: "Approving...",
        disabled: true,
        loading: true,
        onClick: () => {},
        type: "approving" as const,
      }
    }

    if (currentError.code === "QUOTE_LOADING") {
      return {
        label: "Fetching quote…",
        disabled: true,
        loading: true,
        onClick: () => {},
        type: "loading" as const,
      }
    }

    if (currentError.code === "SWAP_PREPARING" || currentError.code === "SWAP_PENDING") {
      return {
        label: "Swapping...",
        disabled: true,
        loading: true,
        onClick: () => {},
        type: "swapping" as const,
      }
    }

    if (allowanceLoading && !fromTokenConfig?.isNative) {
      return {
        label: "Checking allowance...",
        disabled: true,
        loading: true,
        onClick: () => {},
        type: "loading" as const,
      }
    }

    if (currentError.code === "INSUFFICIENT_ALLOWANCE") {
      return {
        label: fromToken ? `Approve ${fromToken.symbol}` : "Approve",
        disabled: false,
        loading: false,
        onClick: async () => {
          try {
            await approveMax()
          } catch (err) {
            console.error("Approve failed:", err)
          }
        },
        type: "approve" as const,
      }
    }

    if (currentError.code !== "NONE") {
      return {
        label: currentError.shortMessage || "Unavailable",
        disabled: true,
        loading: false,
        onClick: () => {},
        type: "error" as const,
      }
    }

    return {
      label: "Swap",
      disabled: false,
      loading: false,
      onClick: fromTokenConfig?.isNative ? handleReview : handleSwap,
      type: "swap" as const,
    }
  }, [
    approveMax,
    approvePending,
    currentError.code,
    currentError.shortMessage,
    fromToken,
    fromTokenConfig?.isNative,
    handleReview,
    isConnected,
    isSupportedChain,
    isSwitchingChain,
    recommendedChain,
    handleSwap,
    switchChain,
    allowanceLoading,
  ])

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

  const bottomErrorMessage =
    currentError.code !== "NONE" &&
    !["SWAP_PREPARING", "SWAP_PENDING"].includes(currentError.code)
      ? currentError.longMessage
      : undefined

  return (
    <>
      <AppPanel variant="dark" className="space-y-6">
        <SwapHeader onOpenSettings={() => setSettingsDialogOpen(true)} />

        {isConnected && !isSupportedChain && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3">
            <div className="text-sm font-semibold text-red-100">Unsupported network</div>
            <div className="text-xs text-red-200">
              Please switch to {supportedNetworkLabel} to use this DEX.
            </div>
          </div>
        )}

        <div className="space-y-4">
          <TokenAmountInput
            side="from"
            label="From"
            token={fromToken}
            amount={fromAmount}
            balance={getBalanceLabel(fromToken)}
            onAmountChange={handleFromAmountChange}
            onClickToken={() => handleOpenTokenDialog("from")}
          />

          <SwapDirectionSwitch onSwitch={handleSwitch} />

          <TokenAmountInput
            side="to"
            label="To"
            token={toToken}
            amount={toAmount}
            balance={getBalanceLabel(toToken)}
            readOnlyAmount
            onClickToken={() => handleOpenTokenDialog("to")}
          />

          <SwapFooter
            toToken={toToken}
            rateText={getRateText()}
            slippageBps={slippageBps}
            reviewParams={reviewParams}
            priceImpactPercent={priceImpactPercent}
            isLoadingQuote={currentError.code === "QUOTE_LOADING"}
            quoteError={currentError.code === "QUOTE_FAILED" ? currentError.shortMessage : undefined}
          />

          <SwapActionButton
            isConnected={isConnected}
            canSubmit={!primaryAction.disabled}
            loading={primaryAction.loading}
            buttonLabel={primaryAction.label}
            onConnect={() => {}}
            onReview={primaryAction.onClick}
          />

          {bottomErrorMessage && (
            <div className="text-xs text-red-500 text-center mt-2">{bottomErrorMessage}</div>
          )}

          {swapSuccess && explorerUrl && (
            <div className="text-xs text-center mt-2">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:underline"
              >
                View on explorer
              </a>
            </div>
          )}
        </div>
      </AppPanel>

      <div className="mt-4">
        <RecentSwaps
          items={recentSwaps.slice(0, 8)}
          chainId={chainId}
          explorerBaseUrl={dexChainConfig?.explorerBaseUrl}
        />
      </div>

      <TokenSelectDialog
        open={tokenDialogOpen}
        side={tokenDialogSide || "from"}
        tokens={tokens}
        selectedToken={tokenDialogSide === "from" ? fromToken : toToken}
        otherSideToken={tokenDialogSide === "from" ? toToken : fromToken}
        isSupportedChain={isSupportedChain}
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

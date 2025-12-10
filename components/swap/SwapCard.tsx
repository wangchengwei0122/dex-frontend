"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useChainId } from "wagmi"
import { AppPanel } from "@/components/app/app-panel"
import { SwapHeader } from "./SwapHeader"
import { SwapTokenRow } from "./SwapTokenRow"
import { SwapDirectionSwitch } from "./SwapDirectionSwitch"
import { SwapFooter } from "./SwapFooter"
import { SwapActionButton } from "./SwapActionButton"
import { TokenSelectDialog } from "./TokenSelectDialog"
import { SwapSettingsDialog } from "./SwapSettingsDialog"
import { useSwapForm } from "./useSwapForm"
import { useTokenBalances } from "@/lib/hooks/useTokenBalances"
import { useTokenAllowance } from "@/lib/hooks/useTokenAllowance"
import { useTokenApproval } from "@/lib/hooks/useTokenApproval"
import { useSwap } from "@/lib/hooks/useSwap"
import { getTokensByChainId } from "@/config/tokens"
import { getUniswapV2RouterAddress } from "@/config/contracts"
import { getExplorerTxUrl } from "@/lib/utils"
import { formatUnits, parseUnits } from "viem"
import type { Token, Side, SwapReviewParams } from "./types"
import type { TokenConfig } from "@/config/tokens"
import { deriveSwapError } from "./errors"
import type { SwapError } from "./errors"
import type { SupportedChainId } from "@/config/contracts"

export interface SwapCardProps {
  tokens?: Token[]
  defaultFromSymbol?: string
  defaultToSymbol?: string
  onReview?: (params: SwapReviewParams) => void
}

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [1, 11155111]

export function SwapCard({
  tokens: propTokens,
  defaultFromSymbol = "ETH",
  defaultToSymbol = "USDC",
  onReview,
}: SwapCardProps) {
  const chainIdFromWagmi = useChainId()

  const tokenConfigs = useMemo(() => getTokensByChainId(chainIdFromWagmi), [chainIdFromWagmi])
  const tokens = useMemo(() => propTokens || tokenConfigs, [propTokens, tokenConfigs])

  const { data: balances, isLoading: balancesLoading } = useTokenBalances({
    tokens,
  })

  const defaultFromToken = useMemo(() => {
    return tokens.find((t) => t.symbol === defaultFromSymbol) || tokens[0] || null
  }, [tokens, defaultFromSymbol])

  const defaultToToken = useMemo(() => {
    const to = tokens.find((t) => t.symbol === defaultToSymbol) || tokens[1] || tokens[0] || null
    return to && to.address !== defaultFromToken?.address ? to : null
  }, [tokens, defaultToSymbol, defaultFromToken])

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
    defaultFromToken,
    defaultToToken,
  })

  useEffect(() => {
    if (!tokens.length) return

    const fromTokenExists = fromToken && tokens.some((t) => t.address === fromToken.address)
    const toTokenExists = toToken && tokens.some((t) => t.address === toToken.address)

    if (!fromTokenExists) {
      setFromToken(defaultFromToken)
    }
    if (!toTokenExists) {
      setToToken(defaultToToken)
    }
  }, [tokens, fromToken, toToken, defaultFromToken, defaultToToken, setFromToken, setToToken])

  const routerAddress = useMemo(() => {
    return chainId ? getUniswapV2RouterAddress(chainId) : undefined
  }, [chainId])

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
    enabled: Boolean(fromTokenConfig && address && routerAddress && isConnected),
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
      onClick: fromTokenConfig?.isNative
        ? handleReview
        : async () => {
          try {
            await swap()
          } catch (err) {
            console.error("Swap failed:", err)
          }
        },
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
    swap,
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
            amount={toAmount}
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
            slippageBps={slippageBps}
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
                View on Etherscan
              </a>
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

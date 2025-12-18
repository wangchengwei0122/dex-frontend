"use client"

import { useCallback, useMemo, useState } from "react"
import { useConnection, useChainId } from "wagmi"
import { parseUnits, type Address } from "viem"
import { useSwapQuote } from "./useSwapQuote"
import { usePairReserves } from "./usePairReserves"
import type { TokenConfig } from "@/config/tokens"
import { getDexChainConfig } from "@/config/chains"
import { calcPriceImpact } from "./utils"
import type { SwapReviewParams, SwapSettings } from "./types"

export interface UseSwapFormParams {
  tokens?: TokenConfig[]
  defaultFromToken?: TokenConfig
  defaultToToken?: TokenConfig
}

export interface UseSwapFormResult {
  fromToken: TokenConfig | null
  toToken: TokenConfig | null
  fromAmount: string
  toAmount: string
  slippageBps: number
  deadlineMinutes: number
  chainId?: number
  address?: Address
  reviewParams: SwapReviewParams | null
  priceImpactPercent?: number
  setFromToken: (token: TokenConfig | null) => void
  setToToken: (token: TokenConfig | null) => void
  setFromAmount: (value: string) => void
  switchTokens: () => void
  setSlippageBps: (value: number) => void
  setDeadlineMinutes: (value: number) => void
  isValid: boolean
  validationError?: string
  isConnected: boolean
  isLoadingQuote: boolean
  isFetchingQuote: boolean
  quoteError: Error | null
  settings: SwapSettings
  setSettings: (value: SwapSettings) => void
  isSupportedChain: boolean
}

export function useSwapForm(params?: UseSwapFormParams): UseSwapFormResult {
  const { defaultFromToken, defaultToToken, tokens = [] } = params || {}

  const chainId = useChainId()
  const { address, isConnected } = useConnection()
  const dexChainConfig = getDexChainConfig(chainId)
  const isSupportedChain = Boolean(dexChainConfig)
  const chainKey = chainId ?? 0

  const [fromTokenMap, setFromTokenMap] = useState<Record<number, TokenConfig | null>>({})
  const [toTokenMap, setToTokenMap] = useState<Record<number, TokenConfig | null>>({})
  const [fromAmountMap, setFromAmountMap] = useState<Record<number, string>>({})
  const [settings, setSettings] = useState<SwapSettings>({
    slippageBps: 30,
    deadlineMinutes: 30,
    oneClickEnabled: false,
  })

  const chainScopedTokens = useMemo(
    () => tokens.filter((token) => !chainId || token.chainId === chainId),
    [chainId, tokens]
  )

  const defaultSelection = useMemo(() => {
    if (chainScopedTokens.length === 0) {
      return { from: null as TokenConfig | null, to: null as TokenConfig | null }
    }

    const preferredFrom =
      defaultFromToken && defaultFromToken.chainId === chainId ? defaultFromToken : null
    const fromCandidate =
      preferredFrom ||
      chainScopedTokens.find((token) => token.isNative) ||
      chainScopedTokens[0] ||
      null

    const preferredTo =
      defaultToToken && defaultToToken.chainId === chainId ? defaultToToken : null
    const toCandidate =
      (preferredTo && preferredTo.address !== fromCandidate?.address ? preferredTo : null) ||
      chainScopedTokens.find((token) => token.isStable && token.address !== fromCandidate?.address) ||
      chainScopedTokens.find((token) => token.address !== fromCandidate?.address) ||
      fromCandidate ||
      null

    return { from: fromCandidate, to: toCandidate }
  }, [chainId, chainScopedTokens, defaultFromToken, defaultToToken])

  const isTokenAvailable = useCallback(
    (token?: TokenConfig | null) =>
      Boolean(
        token &&
        chainScopedTokens.some(
          (candidate) => candidate.address === token.address && candidate.chainId === chainId
        )
      ),
    [chainId, chainScopedTokens]
  )

  const fromToken = useMemo(() => {
    const candidate = fromTokenMap[chainKey]
    if (isTokenAvailable(candidate)) {
      return candidate
    }
    return defaultSelection.from
  }, [chainKey, defaultSelection.from, fromTokenMap, isTokenAvailable])

  const toToken = useMemo(() => {
    const candidate = toTokenMap[chainKey]
    const validCandidate = isTokenAvailable(candidate) ? candidate : null

    if (validCandidate && validCandidate.address !== fromToken?.address) {
      return validCandidate
    }

    if (defaultSelection.to && defaultSelection.to.address !== fromToken?.address) {
      return defaultSelection.to
    }

    const alternate =
      chainScopedTokens.find((token) => token.address !== fromToken?.address && token.chainId === chainId) || null
    return alternate
  }, [chainId, chainScopedTokens, chainKey, defaultSelection.to, fromToken, isTokenAvailable, toTokenMap])

  const fromAmount = fromAmountMap[chainKey] ?? ""

  const setFromToken = (token: TokenConfig | null) => {
    setFromTokenMap((prev) => ({ ...prev, [chainKey]: token }))
  }

  const setToToken = (token: TokenConfig | null) => {
    setToTokenMap((prev) => ({ ...prev, [chainKey]: token }))
  }

  const setFromAmount = (value: string) => {
    setFromAmountMap((prev) => ({ ...prev, [chainKey]: value }))
  }

  const {
    amountOutFormatted,
    amountOutWei,
    amountOutMinWei,
    amountOutMinFormatted,
    isLoading: isLoadingQuote,
    isFetching: isFetchingQuote,
    error: quoteError,
  } = useSwapQuote({
    fromToken,
    toToken,
    amountIn: fromAmount,
    slippageBps: settings.slippageBps,
    chainId,
    enabled: isConnected && isSupportedChain,
  })

  const toAmount = useMemo(() => {
    if (quoteError) {
      return ""
    }
    if (amountOutFormatted) {
      return amountOutFormatted
    }
    if (!fromAmount || !fromToken || !toToken) {
      return ""
    }
    return ""
  }, [amountOutFormatted, fromAmount, fromToken, quoteError, toToken])

  const amountInParsed = useMemo(() => {
    if (!fromToken || !fromAmount || fromAmount === "0") {
      return null
    }
    try {
      const amountNum = Number(fromAmount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return null
      }
      return parseUnits(fromAmount, fromToken.decimals)
    } catch {
      return null
    }
  }, [fromAmount, fromToken])

  const { reserveIn, reserveOut } = usePairReserves({
    fromToken,
    toToken,
    chainId,
  })

  const priceImpactPercent = useMemo(() => {
    if (!reserveIn || !reserveOut || !amountInParsed || !amountOutWei) {
      return undefined
    }
    const impact = calcPriceImpact(amountInParsed, amountOutWei, reserveIn, reserveOut)
    return Number.isFinite(impact) ? impact : undefined
  }, [amountInParsed, amountOutWei, reserveIn, reserveOut])

  const reviewParams = useMemo<SwapReviewParams | null>(() => {
    if (
      !fromToken ||
      !toToken ||
      !amountInParsed ||
      !amountOutMinWei ||
      !chainId ||
      !address ||
      !toAmount ||
      !isSupportedChain
    ) {
      return null
    }

    // Router expects a Unix timestamp; freeze relative deadline into absolute time.
    const deadlineSeconds = settings.deadlineMinutes * 60
    const deadline = Math.floor(Date.now() / 1000) + deadlineSeconds
    const fromAddress = (fromToken.isNative ? fromToken.wrappedAddress : fromToken.address) as
      | Address
      | undefined
    const toAddress = (toToken.isNative ? toToken.wrappedAddress : toToken.address) as
      | Address
      | undefined

    if (!fromAddress || !toAddress) {
      return null
    }

    return {
      chainId,
      fromToken,
      toToken,
      path: [fromAddress, toAddress],
      amountIn: amountInParsed,
      amountOutMin: amountOutMinWei,
      deadline,
      deadlineMinutes: settings.deadlineMinutes,
      humanAmountIn: fromAmount,
      humanAmountOut: amountOutFormatted || toAmount,
      humanAmountOutMin: amountOutMinFormatted || "",
      slippageBps: settings.slippageBps,
      recipient: address,
    }
  }, [
    address,
    amountInParsed,
    amountOutFormatted,
    amountOutMinFormatted,
    amountOutMinWei,
    chainId,
    fromAmount,
    fromToken,
    settings.deadlineMinutes,
    settings.slippageBps,
    isSupportedChain,
    toAmount,
    toToken,
  ])

  const { isValid, validationError } = useMemo(() => {
    if (!isConnected || !address) {
      return { isValid: false, validationError: "Connect wallet" }
    }

    if (!isSupportedChain) {
      return { isValid: false, validationError: "Wrong network" }
    }

    if (!fromToken || !toToken) {
      return { isValid: false, validationError: "Select a token" }
    }

    if (!fromAmount || Number(fromAmount) <= 0 || isNaN(Number(fromAmount))) {
      return { isValid: false, validationError: "Enter an amount" }
    }

    if (quoteError) {
      return { isValid: false, validationError: "Unable to fetch quote" }
    }

    return { isValid: true, validationError: undefined }
  }, [address, fromAmount, fromToken, isConnected, isSupportedChain, quoteError, toToken])

  const setSlippageBps = (value: number) => {
    setSettings((prev) => ({ ...prev, slippageBps: value }))
  }

  const setDeadlineMinutes = (value: number) => {
    setSettings((prev) => ({ ...prev, deadlineMinutes: value }))
  }

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount("")
  }

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippageBps: settings.slippageBps,
    deadlineMinutes: settings.deadlineMinutes,
    chainId,
    address,
    reviewParams,
    priceImpactPercent,
    setFromToken,
    setToToken,
    setFromAmount,
    switchTokens,
    setSlippageBps,
    setDeadlineMinutes,
    isValid,
    validationError,
    isConnected,
    isSupportedChain,
    isLoadingQuote,
    isFetchingQuote,
    quoteError,
    settings,
    setSettings,
  }
}

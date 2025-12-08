"use client"

import { useEffect, useMemo, useState } from "react"
import { useConnection, useChainId } from "wagmi"
import { parseUnits, type Address } from "viem"
import { useSwapQuote } from "@/lib/hooks/useSwapQuote"
import type { TokenConfig } from "@/config/tokens"
import type { SwapReviewParams, SwapSettings } from "./types"

export interface UseSwapFormParams {
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
  setFromToken: (token: TokenConfig | null) => void
  setToToken: (token: TokenConfig | null) => void
  setFromAmount: (value: string) => void
  setToAmount: (value: string) => void
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
}

export function useSwapForm(params?: UseSwapFormParams): UseSwapFormResult {
  const { defaultFromToken, defaultToToken } = params || {}

  const chainId = useChainId()
  const { address, isConnected } = useConnection()

  const [fromToken, setFromToken] = useState<TokenConfig | null>(() => defaultFromToken || null)
  const [toToken, setToToken] = useState<TokenConfig | null>(() => defaultToToken || null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [settings, setSettings] = useState<SwapSettings>({
    slippageBps: 30,
    deadlineMinutes: 30,
    oneClickEnabled: false,
  })

  useEffect(() => {
    if (defaultFromToken && !fromToken) {
      setFromToken(defaultFromToken)
    }
  }, [defaultFromToken, fromToken])

  useEffect(() => {
    if (defaultToToken && !toToken) {
      setToToken(defaultToToken)
    }
  }, [defaultToToken, toToken])

  const {
    amountOutFormatted,
    rawAmountOut,
    isLoading: isLoadingQuote,
    isFetching: isFetchingQuote,
    error: quoteError,
  } = useSwapQuote({
    fromToken,
    toToken,
    amountIn: fromAmount,
    chainId,
    enabled: isConnected,
  })

  useEffect(() => {
    if (quoteError) {
      setToAmount("")
      return
    }

    if (amountOutFormatted) {
      setToAmount(amountOutFormatted)
      return
    }

    if (!fromAmount || !fromToken || !toToken) {
      setToAmount("")
    }
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

  const amountOutMin = useMemo(() => {
    if (!rawAmountOut || !toToken) return null
    const slippageMultiplier = BigInt(10000 - settings.slippageBps)
    const min = (rawAmountOut * slippageMultiplier) / BigInt(10000)
    return min > 0n ? min : null
  }, [rawAmountOut, settings.slippageBps, toToken])

  const reviewParams = useMemo<SwapReviewParams | null>(() => {
    if (
      !fromToken ||
      !toToken ||
      !amountInParsed ||
      !amountOutMin ||
      !chainId ||
      !address ||
      !toAmount
    ) {
      return null
    }

    const deadline = Math.floor(Date.now() / 1000) + settings.deadlineMinutes * 60
    const fromAddress = (
      fromToken.isNative ? fromToken.wrappedAddress || fromToken.address : fromToken.address
    ) as Address
    const toAddress = (
      toToken.isNative ? toToken.wrappedAddress || toToken.address : toToken.address
    ) as Address

    return {
      chainId,
      fromToken,
      toToken,
      path: [fromAddress, toAddress],
      amountIn: amountInParsed,
      amountOutMin,
      deadline,
      humanAmountIn: fromAmount,
      humanAmountOut: toAmount,
      slippageBps: settings.slippageBps,
      recipient: address,
    }
  }, [
    address,
    amountInParsed,
    amountOutMin,
    chainId,
    fromAmount,
    fromToken,
    settings.deadlineMinutes,
    settings.slippageBps,
    toAmount,
    toToken,
  ])

  const { isValid, validationError } = useMemo(() => {
    if (!isConnected || !address) {
      return { isValid: false, validationError: "Connect wallet" }
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
  }, [address, fromAmount, fromToken, isConnected, quoteError, toToken])

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
    setToAmount("")
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
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    switchTokens,
    setSlippageBps,
    setDeadlineMinutes,
    isValid,
    validationError,
    isConnected,
    isLoadingQuote,
    isFetchingQuote,
    quoteError,
    settings,
    setSettings,
  }
}

"use client"

import { useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { SwapCard } from "@/components/swap"
import { SUPPORTED_CHAIN_IDS } from "@/config/chains"
import { getTokensByChainId } from "@/config/tokens"

function useQueryTokenSymbols() {
  const searchParams = useSearchParams()
  const fromParam = searchParams.get("from") ?? undefined
  const toParam = searchParams.get("to") ?? undefined
  const chainParam = searchParams.get("chainId")

  const chainIdFromQuery = useMemo(() => {
    const parsed = chainParam ? Number(chainParam) : undefined
    return Number.isFinite(parsed) ? parsed : undefined
  }, [chainParam])

  const allTokens = useMemo(
    () => SUPPORTED_CHAIN_IDS.flatMap((id) => getTokensByChainId(id)),
    []
  )

  const resolveSymbol = useCallback(
    (value?: string) => {
      if (!value) return undefined
      const lowered = value.toLowerCase()
      const scopedTokens = chainIdFromQuery
        ? allTokens.filter((token) => token.chainId === chainIdFromQuery)
        : allTokens

      const scopedMatch =
        scopedTokens.find((token) => token.symbol.toLowerCase() === lowered) ||
        scopedTokens.find((token) => token.address.toLowerCase() === lowered)
      if (scopedMatch) return scopedMatch.symbol

      const fallbackMatch =
        allTokens.find((token) => token.symbol.toLowerCase() === lowered) ||
        allTokens.find((token) => token.address.toLowerCase() === lowered)
      return fallbackMatch?.symbol
    },
    [allTokens, chainIdFromQuery]
  )

  const defaultFromSymbol = useMemo(
    () => resolveSymbol(fromParam),
    [fromParam, resolveSymbol]
  )
  const defaultToSymbol = useMemo(() => resolveSymbol(toParam), [resolveSymbol, toParam])

  return { defaultFromSymbol, defaultToSymbol }
}

export default function TradePage() {
  const { defaultFromSymbol, defaultToSymbol } = useQueryTokenSymbols()

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
        <SwapCard defaultFromSymbol={defaultFromSymbol} defaultToSymbol={defaultToSymbol} />
      </div>
    </div>
  )
}

"use client"

import { useMemo, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import type { TokenConfig } from "@/config/tokens"
import { AppPanel } from "@/components/app/app-panel"
import { AppInput } from "@/components/app/app-input"
import { cn } from "@/lib/utils"
import { TokenIcon } from "@/components/shared/token-icon"

export interface TokensListProps {
  tokens: TokenConfig[]
  chainId?: number
}

interface TokenRowProps {
  token: TokenConfig
  onSelect: (token: TokenConfig) => void
}

function TokenRow({ token, onSelect }: TokenRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(token)}
      className={cn(
        "w-full grid grid-cols-[1.6fr_0.9fr_1.1fr] gap-4 items-center rounded-2xl px-4 py-3",
        "hover:bg-[rgba(255,255,255,0.02)] transition-colors border border-transparent hover:border-[rgba(201,162,39,0.25)]"
      )}
    >
      <div className="flex items-center gap-3 text-left">
        <TokenIcon
          symbol={token.symbol}
          name={token.name}
          logoURI={token.logoURI}
          size={36}
          className="shadow-[0_0_18px_rgba(201,162,39,0.35)]"
        />
        <div>
          <div className="text-sm font-semibold text-amber-50">{token.name}</div>
          <div className="text-xs text-zinc-500">{token.symbol}</div>
        </div>
      </div>

      <div className="text-sm font-semibold text-amber-100">{token.symbol}</div>

      <div className="text-right">
        <div className="text-sm text-zinc-300">—</div>
        <div className="text-xs text-zinc-500">24h Vol —</div>
      </div>
    </button>
  )
}

export function TokensList({ tokens, chainId }: TokensListProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      const priorityDiff = (a.priority ?? 999) - (b.priority ?? 999)
      if (priorityDiff !== 0) return priorityDiff
      return a.symbol.localeCompare(b.symbol)
    })
  }, [tokens])

  const filteredTokens = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return sortedTokens

    return sortedTokens.filter((token) => {
      const symbolMatch = token.symbol.toLowerCase().includes(query)
      const nameMatch = token.name.toLowerCase().includes(query)
      return symbolMatch || nameMatch
    })
  }, [search, sortedTokens])

  const handleSelect = useCallback(
    (token: TokenConfig) => {
      const params = new URLSearchParams()
      params.set("to", token.symbol)
      if (chainId) {
        params.set("chainId", String(chainId))
      }
      router.push(`/trade?${params.toString()}`)
    },
    [chainId, router]
  )

  return (
    <AppPanel className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tokens</div>
          <div className="text-sm text-zinc-400">Browse supported assets by symbol or name.</div>
        </div>
        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <AppInput
            placeholder="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] divide-y divide-white/5">
        <div className="grid grid-cols-[1.6fr_0.9fr_1.1fr] items-center px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>Token</span>
          <span>Symbol</span>
          <span className="text-right">Market</span>
        </div>

        {filteredTokens.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-zinc-400">No tokens found.</div>
        ) : (
          filteredTokens.map((token) => (
            <TokenRow key={`${token.chainId}-${token.address}-${token.symbol}`} token={token} onSelect={handleSelect} />
          ))
        )}
      </div>
    </AppPanel>
  )
}

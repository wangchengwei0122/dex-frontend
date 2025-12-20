"use client"

import { useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AppButton } from "@/components/app/app-button"
import { TokenIcon } from "@/components/shared/token-icon"
import type { PoolConfig } from "@/config/pools"
import type { TokenConfig } from "@/config/tokens"
import { usePoolOverview } from "@/features/pool/hooks"

export interface TokenPoolMetrics {
  pseudoTvl?: number
  price?: number
  referenceSymbol?: string
  tokenLiquidity?: number
}

export interface TokenPoolsListProps {
  token: TokenConfig
  pools: PoolConfig[]
  onMetrics?: (poolId: string, metrics: TokenPoolMetrics) => void
}

function formatMidPrice(value?: number | null) {
  if (value === undefined || value === null || !Number.isFinite(value) || value <= 0) return "—"
  if (value >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (value >= 1) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 8 })
}

function PoolRow({
  pool,
  token,
  onMetrics,
}: {
  pool: PoolConfig
  token: TokenConfig
  onMetrics?: (poolId: string, metrics: TokenPoolMetrics) => void
}) {
  const router = useRouter()
  const overview = usePoolOverview({ pool })

  const isBaseToken0 = pool.token0.symbol.toLowerCase() === token.symbol.toLowerCase()
  const baseToken = isBaseToken0 ? pool.token0 : pool.token1
  const quoteToken = isBaseToken0 ? pool.token1 : pool.token0

  const derived = useMemo(() => {
    const priceForward = overview.data
      ? isBaseToken0
        ? overview.data.price0Per1
        : overview.data.price1Per1
      : undefined
    const priceReverse = overview.data
      ? isBaseToken0
        ? overview.data.price1Per1
        : overview.data.price0Per1
      : undefined
    const pseudoTvl = overview.data
      ? overview.data.token0Amount + overview.data.token1Amount
      : undefined
    const tokenLiquidity = overview.data
      ? isBaseToken0
        ? overview.data.token0Amount
        : overview.data.token1Amount
      : undefined

    return {
      priceForward,
      priceReverse,
      pseudoTvl,
      tokenLiquidity,
    }
  }, [isBaseToken0, overview.data])

  useEffect(() => {
    if (!onMetrics || !overview.data) return
    if (!derived.priceForward || !Number.isFinite(derived.priceForward) || derived.priceForward <= 0) return

    onMetrics(pool.id, {
      pseudoTvl: derived.pseudoTvl,
      price: derived.priceForward,
      referenceSymbol: quoteToken.symbol,
      tokenLiquidity: derived.tokenLiquidity,
    })
  }, [derived, onMetrics, overview.data, pool.id, quoteToken.symbol])

  const feeLabel =
    pool.feeBps !== undefined ? `${(pool.feeBps / 100).toFixed(2)}%` : "—"

  const handleSwap = useCallback(() => {
    const params = new URLSearchParams()
    params.set("from", quoteToken.symbol)
    params.set("to", baseToken.symbol)
    params.set("chainId", String(pool.chainId))
    router.push(`/trade?${params.toString()}`)
  }, [baseToken.symbol, pool.chainId, quoteToken.symbol, router])

  const handleViewPool = useCallback(() => {
    const params = new URLSearchParams()
    params.set("highlight", pool.id)
    router.push(`/pool?${params.toString()}`)
  }, [pool.id, router])

  return (
    <div className="grid grid-cols-[1.5fr_0.6fr_1.3fr_1fr_1fr] items-center gap-4 px-3 py-4 rounded-2xl border border-transparent hover:border-[rgba(201,162,39,0.28)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <TokenIcon
            symbol={pool.token0.symbol}
            name={pool.token0.name}
            logoURI={pool.token0.logoURI}
            size={40}
            className="absolute left-0 top-0"
          />
          <TokenIcon
            symbol={pool.token1.symbol}
            name={pool.token1.name}
            logoURI={pool.token1.logoURI}
            size={36}
            className="absolute left-5 top-2 border-2 border-[#0A0A0C] shadow-[0_0_16px_rgba(201,162,39,0.15)]"
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-100">
            {pool.token0.symbol} / {pool.token1.symbol}
          </div>
          <div className="text-xs text-zinc-500">
            Pair {pool.pairAddress.slice(0, 6)}...{pool.pairAddress.slice(-4)}
          </div>
        </div>
      </div>

      <div className="text-sm font-semibold text-amber-50">{feeLabel}</div>

      <div className="text-sm text-zinc-200 leading-tight">
        {overview.isLoading ? (
          <span className="text-zinc-500">Loading price...</span>
        ) : overview.isError ? (
          <span className="text-rose-200">Failed</span>
        ) : (
          <>
            <div>
              1 {baseToken.symbol} ≈ {formatMidPrice(derived.priceForward)} {quoteToken.symbol}
            </div>
            <div className="text-xs text-zinc-500">
              1 {quoteToken.symbol} ≈ {formatMidPrice(derived.priceReverse)} {baseToken.symbol}
            </div>
          </>
        )}
      </div>

      <div className="text-sm text-zinc-300 leading-tight">
        {overview.isLoading ? (
          <span className="text-zinc-500">Loading TVL...</span>
        ) : overview.isError ? (
          <span className="text-rose-200">Failed</span>
        ) : derived.pseudoTvl ? (
          <>
            <div>
              Est. TVL ~{" "}
              {derived.pseudoTvl.toLocaleString(undefined, { maximumFractionDigits: 2 })} units
            </div>
            <div className="text-xs text-zinc-500">
              {derived.tokenLiquidity?.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
              {baseToken.symbol} +{" "}
              {(derived.pseudoTvl - (derived.tokenLiquidity ?? 0)).toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}{" "}
              {quoteToken.symbol}
            </div>
          </>
        ) : (
          <span className="text-zinc-500">—</span>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <AppButton size="sm" onClick={handleSwap} className="px-4">
          Swap
        </AppButton>
        <AppButton size="sm" variant="outline" onClick={handleViewPool} className="px-4">
          View Pool
        </AppButton>
      </div>
    </div>
  )
}

export function TokenPoolsList({ token, pools, onMetrics }: TokenPoolsListProps) {
  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
  }, [pools])

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] divide-y divide-white/5">
      <div className="grid grid-cols-[1.5fr_0.6fr_1.3fr_1fr_1fr] items-center px-3 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
        <span>Pool</span>
        <span>Fee</span>
        <span>Price</span>
        <span>TVL</span>
        <span className="text-right">Actions</span>
      </div>
      {sortedPools.map((pool) => (
        <PoolRow key={`${pool.chainId}-${pool.id}`} pool={pool} token={token} onMetrics={onMetrics} />
      ))}
    </div>
  )
}

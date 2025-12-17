"use client"

import { useMemo, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { formatUnits } from "viem"
import { Search } from "lucide-react"
import type { PoolConfig } from "@/config/pools"
import type { UserPoolPosition } from "@/features/swap/engine/types"
import { usePairReserves } from "@/features/swap/engine"
import { AppPanel } from "@/components/app/app-panel"
import { AppInput } from "@/components/app/app-input"
import { cn } from "@/lib/utils"

export interface PoolsListProps {
  pools: PoolConfig[]
  userPositions?: UserPoolPosition[]
  chainId?: number
  isConnected?: boolean
}

interface PoolRowProps {
  pool: PoolConfig
  position?: UserPoolPosition
  onSelect: (pool: PoolConfig) => void
  showConnectHint: boolean
}

function formatMidPrice(value?: number) {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return undefined
  }
  if (value >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

function PoolRow({ pool, position, onSelect, showConnectHint }: PoolRowProps) {
  const { reserveIn, reserveOut, loading } = usePairReserves({
    fromToken: pool.token0,
    toToken: pool.token1,
    chainId: pool.chainId,
  })

  const reserveStats = useMemo(() => {
    if (!reserveIn || !reserveOut) return null

    const amount0 = Number(formatUnits(reserveIn, pool.token0.decimals))
    const amount1 = Number(formatUnits(reserveOut, pool.token1.decimals))

    if (!Number.isFinite(amount0) || !Number.isFinite(amount1) || amount0 <= 0 || amount1 <= 0) {
      return null
    }

    return {
      amount0,
      amount1,
      price0: amount1 / amount0,
      price1: amount0 / amount1,
      pseudoTvl: amount0 + amount1,
    }
  }, [pool.token0.decimals, pool.token1.decimals, reserveIn, reserveOut])

  const priceText =
    reserveStats &&
    `1 ${pool.token0.symbol} ≈ ${formatMidPrice(reserveStats.price0) ?? "—"} ${pool.token1.symbol}`
  const reverseText =
    reserveStats &&
    `1 ${pool.token1.symbol} ≈ ${formatMidPrice(reserveStats.price1) ?? "—"} ${pool.token0.symbol}`

  const liquiditySummary = useMemo(() => {
    if (!reserveStats) return null

    return {
      headline: `Liquidity ~ ${reserveStats.pseudoTvl.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} units`,
      breakdown: `${reserveStats.amount0.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${
        pool.token0.symbol
      } / ${reserveStats.amount1.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${
        pool.token1.symbol
      }`,
    }
  }, [pool.token0.symbol, pool.token1.symbol, reserveStats])

  const liquidityText = showConnectHint
    ? "Connect wallet"
    : position
      ? `${position.pooledToken0} ${pool.token0.symbol} + ${position.pooledToken1} ${pool.token1.symbol}`
      : "—"

  const feeLabel =
    pool.feeBps !== undefined ? `${(pool.feeBps / 100).toFixed(2)}%` : "—"

  return (
    <button
      type="button"
      onClick={() => onSelect(pool)}
      className={cn(
        "w-full grid grid-cols-[1.5fr_0.7fr_1.3fr_0.7fr_0.9fr] gap-4 items-center rounded-2xl px-4 py-3",
        "hover:bg-[rgba(255,255,255,0.02)] transition-colors border border-transparent hover:border-[rgba(201,162,39,0.25)] text-left"
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-amber-50">
          {pool.token0.symbol} / {pool.token1.symbol}
        </div>
        <div className="text-xs text-zinc-500">
          Pair {pool.pairAddress.slice(0, 6)}...{pool.pairAddress.slice(-4)}
        </div>
      </div>

      <div className="text-sm font-semibold text-amber-100">{feeLabel}</div>

      <div className="text-sm text-zinc-200 leading-tight">
        {loading ? (
          <span className="text-zinc-500">Loading price...</span>
        ) : priceText ? (
          <>
            <div>{priceText}</div>
            <div className="text-xs text-zinc-500">{reverseText}</div>
          </>
        ) : (
          <span className="text-zinc-500">—</span>
        )}
      </div>

      <div className="text-sm text-zinc-300 leading-tight">
        {loading ? (
          <span className="text-zinc-500">Loading TVL...</span>
        ) : liquiditySummary ? (
          <>
            <div>{liquiditySummary.headline}</div>
            <div className="text-xs text-zinc-500">{liquiditySummary.breakdown}</div>
          </>
        ) : (
          <span className="text-zinc-500">—</span>
        )}
      </div>

      <div
        className={cn(
          "text-right text-sm",
          showConnectHint ? "text-zinc-400" : position ? "text-amber-100" : "text-amber-50"
        )}
      >
        {liquidityText}
      </div>
    </button>
  )
}

export function PoolsList({ pools, userPositions, chainId, isConnected }: PoolsListProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const positionMap = useMemo(() => {
    if (!userPositions?.length) return new Map<string, UserPoolPosition>()
    return new Map(userPositions.map((pos) => [pos.poolId, pos]))
  }, [userPositions])

  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => {
      const priorityDiff = (a.priority ?? 999) - (b.priority ?? 999)
      if (priorityDiff !== 0) return priorityDiff
      return `${a.token0.symbol}/${a.token1.symbol}`.localeCompare(
        `${b.token0.symbol}/${b.token1.symbol}`
      )
    })
  }, [pools])

  const filteredPools = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return sortedPools

    return sortedPools.filter((pool) => {
      const name = `${pool.token0.symbol}/${pool.token1.symbol}`.toLowerCase()
      const token0Name = `${pool.token0.name} ${pool.token0.symbol}`.toLowerCase()
      const token1Name = `${pool.token1.name} ${pool.token1.symbol}`.toLowerCase()
      return (
        name.includes(query) ||
        token0Name.includes(query) ||
        token1Name.includes(query)
      )
    })
  }, [search, sortedPools])

  const handleSelect = useCallback(
    (pool: PoolConfig) => {
      const params = new URLSearchParams()
      params.set("from", pool.token0.symbol)
      params.set("to", pool.token1.symbol)
      const targetChainId = pool.chainId ?? chainId
      if (targetChainId) {
        params.set("chainId", String(targetChainId))
      }
      router.push(`/trade?${params.toString()}`)
    },
    [chainId, router]
  )

  const showConnectHint = !isConnected

  return (
    <AppPanel className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Pools</div>
          <div className="text-sm text-zinc-400">View configured liquidity pools by pair.</div>
        </div>
        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <AppInput
            placeholder="Search pools"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] divide-y divide-white/5">
        <div className="grid grid-cols-[1.5fr_0.7fr_1.3fr_0.7fr_0.9fr] items-center px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>Pool</span>
          <span>Fee</span>
          <span>Price</span>
          <span>TVL</span>
          <span className="text-right">My Liquidity</span>
        </div>

        {filteredPools.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-zinc-400">No pools found.</div>
        ) : (
          filteredPools.map((pool) => (
            <PoolRow
              key={`${pool.chainId}-${pool.id}`}
              pool={pool}
              position={positionMap.get(pool.id)}
              onSelect={handleSelect}
              showConnectHint={showConnectHint}
            />
          ))
        )}
      </div>
    </AppPanel>
  )
}

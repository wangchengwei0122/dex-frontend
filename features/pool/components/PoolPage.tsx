"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useAccount, useChainId } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { ArrowRight, AlertTriangle } from "lucide-react"
import { AppPanel } from "@/components/app/app-panel"
import { AppButton } from "@/components/app/app-button"
import { AppSectionTitle } from "@/components/app/app-section-title"
import { TokenIcon } from "@/components/shared/token-icon"
import { getDexChainConfig, SUPPORTED_CHAIN_IDS } from "@/config/chains"
import { getPoolsByChainId, type PoolConfig } from "@/config/pools"
import { usePoolOverview } from "@/features/pool/hooks"
import { useUserPools } from "@/features/swap/engine/useUserPools"
import type { UserPoolPosition } from "@/features/swap/engine/types"

interface PoolWithLiquidity {
  pool: PoolConfig
  liquidity?: UserPoolPosition
}

function formatPrice(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—"
  return value.toFixed(4).replace(/\.?0+$/, "") || "0"
}

function MyPoolsList({ items }: { items: PoolWithLiquidity[] }) {
  return (
    <div className="divide-y divide-white/5 rounded-2xl border border-[rgba(201,162,39,0.25)] bg-[rgba(12,12,14,0.8)]">
      {items.map(({ pool, liquidity }) => (
        <div
          key={pool.id}
          className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[1.4fr_1.2fr_0.8fr] sm:items-center"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
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

          <div className="text-sm text-right sm:text-left">
            <div className="text-amber-50">
              Pooled: {liquidity?.pooledToken0 ?? "0"} {pool.token0.symbol}
            </div>
            <div className="text-zinc-400">
              + {liquidity?.pooledToken1 ?? "0"} {pool.token1.symbol}
            </div>
          </div>

          <div className="text-right text-sm text-amber-100">
            Share: {(liquidity?.sharePercent ?? 0).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-4 animate-pulse"
        >
          <div className="h-10 w-36 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
      ))}
    </div>
  )
}

function AllPoolsList({
  pools,
  liquidityMap,
}: {
  pools: PoolConfig[]
  liquidityMap: Map<string, UserPoolPosition | undefined>
}) {
  return (
    <div className="divide-y divide-white/5 rounded-2xl border border-[rgba(201,162,39,0.25)] bg-[rgba(12,12,14,0.8)]">
      {pools.map((pool) => (
        <PoolOverviewRow key={pool.id} pool={pool} liquidity={liquidityMap.get(pool.id)} />
      ))}
    </div>
  )
}

function PoolOverviewRow({
  pool,
  liquidity,
}: {
  pool: PoolConfig
  liquidity?: UserPoolPosition
}) {
  const overview = usePoolOverview({ pool })

  const isLoading = overview.isLoading
  const hasError = overview.isError
  const price0 = overview.data?.price0Per1 ?? null
  const price1 = overview.data?.price1Per1 ?? null

  return (
    <div
      className="flex flex-col gap-3 px-4 py-4 sm:grid sm:grid-cols-[1.4fr_1.2fr_1fr_0.8fr] sm:items-center"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10">
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

      <div className="text-sm text-amber-50">
        {isLoading ? (
          <span className="text-zinc-500">Loading price...</span>
        ) : hasError ? (
          <span className="text-rose-200">Failed to fetch price</span>
        ) : (
          <>
            <div>
              Price: 1 {pool.token0.symbol} ≈ {formatPrice(price0)} {pool.token1.symbol}
            </div>
            <div className="text-xs text-zinc-500">
              1 {pool.token1.symbol} ≈ {formatPrice(price1)} {pool.token0.symbol}
            </div>
          </>
        )}
      </div>

      <div className="text-sm text-zinc-300">
        My share:{" "}
        {liquidity ? `${liquidity.sharePercent.toFixed(2)}%` : <span className="text-zinc-500">—</span>}
      </div>

      <div className="text-sm text-right text-zinc-400">TVL —</div>
    </div>
  )
}

export function PoolPage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { openConnectModal } = useConnectModal()

  const dexChainConfig = getDexChainConfig(chainId)
  const supportedChainsLabel = useMemo(
    () =>
      SUPPORTED_CHAIN_IDS.map((id) => getDexChainConfig(id)?.name || `Chain ${id}`).join(" / "),
    []
  )

  const pools = useMemo(() => getPoolsByChainId(chainId), [chainId])

  const {
    positions,
    isLoading: isLoadingUserPools,
    isError: hasUserPoolError,
  } = useUserPools({ chainId, account: address })

  const liquidityMap = useMemo(
    () => new Map(positions.map((position) => [position.poolId, position])),
    [positions]
  )

  const myPools = useMemo(
    () =>
      positions
        .map((position) => {
          const pool = pools.find((item) => item.id === position.poolId)
          if (!pool) return undefined
          return {
            pool,
            liquidity: position,
          }
        })
        .filter(Boolean) as PoolWithLiquidity[],
    [pools, positions]
  )

  const isLoadingMyPools = isLoadingUserPools

  const showEmptyMyPools =
    isConnected && dexChainConfig && !isLoadingMyPools && !myPools.length && !hasUserPoolError

  return (
    <div className="py-10 space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Liquidity</p>
          <h1 className="text-3xl font-semibold text-amber-100">My Pools</h1>
          <p className="text-sm text-zinc-400">
            Review your LP positions across the supported Uniswap V2 pools.
          </p>
        </div>
        <AppButton variant="outline" size="sm" asChild>
          <Link href="/">
            Go to Swap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AppButton>
      </div>

      <AppPanel className="space-y-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[rgba(201,162,39,0.25)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
            <p className="text-lg font-semibold text-amber-100">
              Connect wallet to view your liquidity
            </p>
            <p className="text-sm text-zinc-400">
              Link your wallet to check positions across configured pools.
            </p>
            <AppButton size="lg" onClick={() => openConnectModal?.()}>
              Connect Wallet
            </AppButton>
          </div>
        ) : !dexChainConfig ? (
          <div className="flex gap-3 rounded-2xl border border-[rgba(201,162,39,0.35)] bg-[rgba(201,162,39,0.08)] p-6">
            <AlertTriangle className="h-6 w-6 text-amber-200 shrink-0" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-amber-100">Unsupported network</p>
              <p className="text-sm text-amber-50/80">
                Please switch to {supportedChainsLabel} to view your pools.
              </p>
            </div>
          </div>
        ) : isLoadingMyPools ? (
          <SkeletonList />
        ) : hasUserPoolError && !myPools.length ? (
          <div className="rounded-2xl border border-[rgba(255,99,99,0.35)] bg-[rgba(120,20,20,0.28)] px-4 py-5 text-center text-sm text-rose-100">
            Failed to load your liquidity, please try again later.
          </div>
        ) : showEmptyMyPools ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-10 text-center">
            <p className="text-lg font-semibold text-amber-100">No liquidity positions yet</p>
            <p className="text-sm text-zinc-400">
              Provide liquidity in any supported pair to see it listed here.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AppButton asChild>
                <Link href="/">
                  Go to Swap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AppButton>
            </div>
          </div>
        ) : myPools.length ? (
          <>
            {hasUserPoolError ? (
              <div className="rounded-xl border border-[rgba(255,99,99,0.35)] bg-[rgba(120,20,20,0.28)] px-4 py-3 text-sm text-rose-100">
                Some pools failed to load. Showing available positions.
              </div>
            ) : null}
            <MyPoolsList items={myPools} />
          </>
        ) : (
          <div className="rounded-2xl border border-[rgba(255,99,99,0.35)] bg-[rgba(120,20,20,0.28)] px-4 py-5 text-center text-sm text-rose-100">
            Failed to load your liquidity, please try again later.
          </div>
        )}
      </AppPanel>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <AppSectionTitle className="text-xs text-zinc-500">All Pools</AppSectionTitle>
          <span className="text-xs text-zinc-500">
            Browse all supported liquidity pools on this network.
          </span>
        </div>
        <AppPanel className="space-y-4">
          {!pools.length ? (
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-8 text-center text-sm text-zinc-400">
              No supported pools on this network yet.
            </div>
          ) : (
            <AllPoolsList pools={pools} liquidityMap={liquidityMap} />
          )}
        </AppPanel>
      </div>
    </div>
  )
}

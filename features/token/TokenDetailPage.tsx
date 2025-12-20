"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, ArrowLeft, ExternalLink, Sparkles } from "lucide-react"
import { AppPanel } from "@/components/app/app-panel"
import { AppButton } from "@/components/app/app-button"
import { AppSectionTitle } from "@/components/app/app-section-title"
import { TokenIcon } from "@/components/shared/token-icon"
import { getDexChainConfig, toSupportedChainId } from "@/config/chains"
import { getPoolsByChainId, type PoolConfig } from "@/config/pools"
import { getTokensByChainId, type TokenConfig } from "@/config/tokens"
import { cn } from "@/lib/utils"
import { TokenPoolsList, type TokenPoolMetrics } from "./components/TokenPoolsList"

interface TokenDetailPageProps {
  chainIdParam: number | string
  symbolParam: string
}

interface SnapshotData {
  estimatedPrice?: number
  priceQuoteSymbol?: string
  tokenLiquidity?: number
}

export function TokenDetailPage({ chainIdParam, symbolParam }: TokenDetailPageProps) {
  const router = useRouter()
  const parsedChainId = useMemo(() => Number(chainIdParam), [chainIdParam])
  const chainId = toSupportedChainId(Number.isFinite(parsedChainId) ? parsedChainId : undefined)
  const chainConfig = getDexChainConfig(chainId)

  const tokens = useMemo(() => (chainId ? getTokensByChainId(chainId) : []), [chainId])
  const pools = useMemo(() => (chainId ? getPoolsByChainId(chainId) : []), [chainId])

  const token = useMemo(() => {
    const lowered = symbolParam?.toLowerCase()
    return tokens.find((item) => item.symbol.toLowerCase() === lowered)
  }, [symbolParam, tokens])

  const poolsForToken = useMemo(() => {
    if (!token) return []
    return pools.filter(
      (pool) =>
        pool.token0.symbol.toLowerCase() === token.symbol.toLowerCase() ||
        pool.token1.symbol.toLowerCase() === token.symbol.toLowerCase()
    )
  }, [pools, token])

  const [metricsMap, setMetricsMap] = useState<Record<string, TokenPoolMetrics>>({})

  const handleMetricsUpdate = useCallback((poolId: string, metrics: TokenPoolMetrics) => {
    setMetricsMap((prev) => ({
      ...prev,
      [poolId]: { ...(prev[poolId] ?? {}), ...metrics },
    }))
  }, [])

  const snapshot: SnapshotData = useMemo(() => {
    const metrics = Object.values(metricsMap)
    if (!metrics.length) return {}

    const withLiquidity = metrics.filter(
      (item) => item.pseudoTvl !== undefined && item.price !== undefined
    )
    const bestByLiquidity = [...withLiquidity].sort(
      (a, b) => (b.pseudoTvl ?? 0) - (a.pseudoTvl ?? 0)
    )[0]

    const totalTokenLiquidity = metrics.reduce(
      (sum, item) => sum + (item.tokenLiquidity ?? 0),
      0
    )

    return {
      estimatedPrice: bestByLiquidity?.price,
      priceQuoteSymbol: bestByLiquidity?.referenceSymbol,
      tokenLiquidity: totalTokenLiquidity > 0 ? totalTokenLiquidity : undefined,
    }
  }, [metricsMap])

  const networkLabel = chainConfig ? chainConfig.name : `Chain ${chainIdParam}`

  const handleBack = useCallback(() => {
    router.push("/explore")
  }, [router])

  if (!chainId || !chainConfig) {
    return (
      <div className="py-10 space-y-6">
        <AppPanel className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0" />
            <div>
              <div className="text-lg font-semibold text-amber-50">Unsupported network</div>
              <p className="text-sm text-zinc-400">
                The requested network is not configured. Please switch to a supported chain and
                try again.
              </p>
            </div>
          </div>
          <AppButton onClick={handleBack} size="sm" variant="outline" className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </AppButton>
        </AppPanel>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="py-10 space-y-6">
        <AppPanel className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0" />
            <div>
              <div className="text-lg font-semibold text-amber-50">Token not found</div>
              <p className="text-sm text-zinc-400">
                {symbolParam} is not part of the curated token list for {networkLabel}.
              </p>
            </div>
          </div>
          <AppButton onClick={handleBack} size="sm" variant="outline" className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </AppButton>
        </AppPanel>
      </div>
    )
  }

  const isNative = token.isNative || token.address === "native"
  const explorerLink =
    !isNative && token.address
      ? `${chainConfig.explorerBaseUrl}/token/${token.address}`
      : undefined

  const tagList = token.tags ?? []

  const estimatedPriceLabel =
    snapshot.estimatedPrice && snapshot.priceQuoteSymbol
      ? `1 ${token.symbol} ≈ ${snapshot.estimatedPrice.toLocaleString(undefined, {
          maximumFractionDigits: 6,
        })} ${snapshot.priceQuoteSymbol}`
      : "—"

  const liquidityLabel = snapshot.tokenLiquidity
    ? `${snapshot.tokenLiquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${
        token.symbol
      } in pools`
    : "—"

  return (
    <div className="py-10 space-y-8">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center text-sm text-zinc-500 hover:text-amber-100 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </button>
        <div className="flex items-center gap-4">
          <TokenIcon
            symbol={token.symbol}
            name={token.name}
            logoURI={token.logoURI}
            size={52}
            className="shadow-[0_0_28px_rgba(201,162,39,0.35)]"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Token</p>
            <h1 className="text-3xl font-semibold text-amber-100">
              {token.name} <span className="text-amber-300/80">({token.symbol})</span>
            </h1>
            <p className="text-sm text-zinc-400">Curated listing on {networkLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <AppPanel className="space-y-6">
          <AppSectionTitle>Token Header</AppSectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-zinc-500">Network</div>
                <div className="text-lg font-semibold text-amber-50">{networkLabel}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Type</div>
                <div className="text-lg font-semibold text-amber-50">
                  {isNative ? "Native" : "ERC20"}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Tags</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tagList.length === 0 ? (
                    <span className="text-sm text-zinc-500">—</span>
                  ) : (
                    tagList.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.2)] px-3 py-1 text-xs text-amber-100"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-zinc-500">Contract</div>
                {isNative ? (
                  <div className="text-lg font-semibold text-amber-50">—</div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-50">
                    <span className="font-mono text-sm break-all">
                      {token.address?.slice(0, 6)}...{token.address?.slice(-4)}
                    </span>
                    {explorerLink && (
                      <Link
                        href={explorerLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-200 hover:text-amber-100 inline-flex items-center gap-1"
                      >
                        Etherscan
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-zinc-500">Decimals</div>
                <div className="text-lg font-semibold text-amber-50">{token.decimals}</div>
              </div>
            </div>
          </div>
        </AppPanel>

        <AppPanel className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <AppSectionTitle>Estimated Market Snapshot</AppSectionTitle>
            <Sparkles className="h-4 w-4 text-amber-300" />
          </div>
          <p className="text-xs text-amber-200/80">
            Prices and liquidity are estimated from on-chain pool reserves.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <div className="text-xs text-zinc-500">Estimated Price (mid)</div>
              <div className="text-xl font-semibold text-amber-50 mt-1">{estimatedPriceLabel}</div>
              <div className="text-xs text-zinc-500 mt-1">
                Based on the most liquid configured pool.
              </div>
            </div>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <div className="text-xs text-zinc-500">Estimated Liquidity</div>
              <div className="text-xl font-semibold text-amber-50 mt-1">{liquidityLabel}</div>
              <div className="text-xs text-zinc-500 mt-1">Sum of token balances across pools.</div>
            </div>
          </div>
        </AppPanel>
      </div>

      <AppPanel className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <AppSectionTitle>Pools Involving This Token</AppSectionTitle>
          <span className="text-xs text-zinc-500">
            Showing {poolsForToken.length} configured pool{poolsForToken.length === 1 ? "" : "s"}
          </span>
        </div>
        {poolsForToken.length === 0 ? (
          <div className="text-sm text-zinc-500">
            No configured pools found for this token on {networkLabel}.
          </div>
        ) : (
          <TokenPoolsList
            token={token}
            pools={poolsForToken}
            onMetrics={handleMetricsUpdate}
          />
        )}
      </AppPanel>

      <AppPanel className="space-y-4">
        <AppSectionTitle>Actions</AppSectionTitle>
        <p className="text-sm text-zinc-400">
          Jump straight into swapping or providing liquidity with pre-filled routes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AppButton
            size="lg"
            className="flex-1"
            onClick={() => {
              const params = new URLSearchParams()
              params.set("from", token.symbol)
              params.set("chainId", String(chainId))
              router.push(`/trade?${params.toString()}`)
            }}
          >
            Swap {token.symbol}
          </AppButton>
          <AppButton
            size="lg"
            variant="secondary"
            className="flex-1"
            onClick={() => {
              const params = new URLSearchParams()
              params.set("to", token.symbol)
              params.set("chainId", String(chainId))
              router.push(`/trade?${params.toString()}`)
            }}
          >
            Swap to {token.symbol}
          </AppButton>
        </div>
      </AppPanel>
    </div>
  )
}

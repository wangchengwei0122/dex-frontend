"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useChainId, useConnection } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { ArrowRight } from "lucide-react"
import { AppPanel } from "@/components/app/app-panel"
import { AppButton } from "@/components/app/app-button"
import { getDexChainConfig, SUPPORTED_CHAIN_IDS } from "@/config/chains"
import { useUserPools } from "@/features/swap/engine"
import type { UserPoolPosition } from "@/features/swap/engine"

function PoolTable({ positions }: { positions: UserPoolPosition[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.25)] bg-[rgba(12,12,14,0.8)]">
      <table className="w-full text-sm">
        <thead className="bg-[rgba(255,255,255,0.02)] text-xs uppercase tracking-[0.12em] text-zinc-400">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Pool</th>
            <th className="px-4 py-3 text-right font-semibold">My Liquidity</th>
            <th className="px-4 py-3 text-right font-semibold">Share</th>
            <th className="px-4 py-3 text-right font-semibold">TVL</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr
              key={position.poolId}
              className="border-t border-white/5 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
            >
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col">
                  <span className="font-semibold text-amber-100">
                    {position.token0.symbol} / {position.token1.symbol}
                  </span>
                  <span className="text-xs text-zinc-500">
                    Pair {position.pairAddress.slice(0, 6)}...{position.pairAddress.slice(-4)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="font-mono text-[15px] text-zinc-100">
                    {position.pooledToken0} {position.token0.symbol}
                  </span>
                  <span className="font-mono text-sm text-zinc-400">
                    {position.pooledToken1} {position.token1.symbol}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 align-middle text-right">
                <span className="font-mono text-[15px] text-amber-200">
                  {position.sharePercent.toFixed(4)}%
                </span>
              </td>
              <td className="px-4 py-4 align-middle text-right text-zinc-500">—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="grid grid-cols-[1.3fr_1.2fr_0.8fr_0.6fr] gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-4 animate-pulse"
        >
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10 justify-self-end" />
          <div className="h-4 w-10 rounded bg-white/10 justify-self-end" />
        </div>
      ))}
    </div>
  )
}

export default function PoolPage() {
  const chainId = useChainId()
  const { address, isConnected } = useConnection()
  const { openConnectModal } = useConnectModal()

  const dexChainConfig = getDexChainConfig(chainId)
  const supportedChainsLabel = useMemo(
    () =>
      SUPPORTED_CHAIN_IDS.map((id) => getDexChainConfig(id)?.name || `Chain ${id}`).join(" / "),
    []
  )

  const { positions, isLoading, isError, error } = useUserPools({
    chainId,
    account: address,
  })

  const showEmpty = isConnected && dexChainConfig && !positions.length && !isLoading

  return (
    <div className="py-10 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Liquidity</p>
          <h1 className="text-2xl font-semibold text-amber-100">My Pools</h1>
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
          <div className="rounded-2xl border border-[rgba(201,162,39,0.35)] bg-[rgba(201,162,39,0.08)] p-6">
            <p className="text-lg font-semibold text-amber-100">Unsupported network</p>
            <p className="text-sm text-amber-50/80">
              Please switch to {supportedChainsLabel} to view your pools.
            </p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-[rgba(255,99,99,0.4)] bg-[rgba(120,20,20,0.35)] p-6 text-rose-100">
            <p className="text-lg font-semibold">Failed to load pools</p>
            <p className="text-sm text-rose-50/80">{error?.message ?? "Unknown error"}</p>
          </div>
        ) : isLoading ? (
          <SkeletonTable />
        ) : showEmpty ? (
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
        ) : (
          <PoolTable positions={positions} />
        )}
      </AppPanel>
    </div>
  )
}

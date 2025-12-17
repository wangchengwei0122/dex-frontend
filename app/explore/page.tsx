"use client"

import { useMemo } from "react"
import { AlertTriangle } from "lucide-react"
import { useConnection, useChainId } from "wagmi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokensList } from "@/components/explore/TokensList"
import { PoolsList } from "@/components/explore/PoolsList"
import {
  getDexChainConfig,
  PREFERRED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
  toSupportedChainId,
  type SupportedChainId,
} from "@/config/chains"
import { getTokensByChainId } from "@/config/tokens"
import { getPoolsByChainId } from "@/config/pools"
import { useUserPools } from "@/features/swap/engine"

export default function ExplorePage() {
  const { address, isConnected } = useConnection()
  const chainId = toSupportedChainId(useChainId())

  const dexChainConfig = getDexChainConfig(chainId)
  const dataChainId: SupportedChainId =
    toSupportedChainId(dexChainConfig ? chainId : PREFERRED_CHAIN_ID) ??
    (PREFERRED_CHAIN_ID as SupportedChainId)

  const supportedNetworksLabel = useMemo(
    () => SUPPORTED_CHAIN_IDS.map((id) => getDexChainConfig(id)?.name || `Chain ${id}`).join(" / "),
    []
  )

  const tokens = getTokensByChainId(dataChainId)
  const pools = getPoolsByChainId(dataChainId)

  const shouldLoadUserPools = Boolean(dexChainConfig && address)

  const { positions } = useUserPools({
    chainId: shouldLoadUserPools ? chainId : undefined,
    account: shouldLoadUserPools ? address : undefined,
  })

  return (
    <div className="py-10 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Discover</p>
        <h1 className="text-3xl font-semibold text-amber-100">Explore</h1>
        <p className="text-sm text-zinc-400">Browse tokens and pools supported by this DEX.</p>
      </div>

      {!dexChainConfig && (
        <div className="rounded-2xl border border-[rgba(201,162,39,0.35)] bg-[rgba(201,162,39,0.08)] p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-200 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-semibold text-amber-100">Unsupported network</div>
            <div className="text-xs text-amber-50/80">
              Explore data is shown from configured networks. Switch to {supportedNetworksLabel} for
              on-chain actions.
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="tokens" className="space-y-4">
        <TabsList className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,162,39,0.2)] p-1 rounded-xl w-fit">
          <TabsTrigger
            value="tokens"
            className="data-[state=active]:bg-[rgba(201,162,39,0.14)] data-[state=active]:text-amber-100 text-zinc-300"
          >
            Tokens
          </TabsTrigger>
          <TabsTrigger
            value="pools"
            className="data-[state=active]:bg-[rgba(201,162,39,0.14)] data-[state=active]:text-amber-100 text-zinc-300"
          >
            Pools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
          <TokensList tokens={tokens} chainId={dataChainId} />
        </TabsContent>

        <TabsContent value="pools">
          <PoolsList
            pools={pools}
            userPositions={positions}
            chainId={dataChainId}
            isConnected={isConnected}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

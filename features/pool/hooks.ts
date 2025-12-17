"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useChainId, usePublicClient } from "wagmi"
import { formatUnits, type Address } from "viem"
import { uniswapV2PairAbi } from "@/lib/abi/uniswapV2Pair"
import type { PoolConfig } from "@/config/pools"

interface UsePoolOverviewParams {
  pool: PoolConfig | undefined
}

export interface PoolOverview {
  reserve0: bigint
  reserve1: bigint
  totalSupply: bigint
  token0Amount: number
  token1Amount: number
  price0Per1: number | null
  price1Per1: number | null
}

interface UsePoolOverviewResult {
  data?: PoolOverview
  isLoading: boolean
  isError: boolean
}

function toNumber(value: bigint, decimals: number): number {
  const formatted = formatUnits(value, decimals)
  const num = Number(formatted)
  return Number.isFinite(num) ? num : 0
}

export function usePoolOverview({ pool }: UsePoolOverviewParams): UsePoolOverviewResult {
  const chainId = useChainId()
  const targetChainId = pool?.chainId ?? chainId
  const publicClient = usePublicClient({ chainId: targetChainId as any })

  const shouldSkip = !pool

  const query = useQuery({
    queryKey: ["pool-overview", pool?.chainId, pool?.id],
    enabled: Boolean(!shouldSkip && publicClient),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async () => {
      if (!pool || !publicClient) return undefined

      const multicallResult = (await publicClient.multicall({
        allowFailure: true,
        contracts: [
          { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "getReserves" } as const,
          { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "totalSupply" } as const,
        ],
      })) as any

      const [reservesResult, totalSupplyResult] = multicallResult?.results ?? multicallResult ?? []

      if (
        !reservesResult ||
        reservesResult.status !== "success" ||
        !totalSupplyResult ||
        totalSupplyResult.status !== "success"
      ) {
        throw new Error("Failed to fetch pool overview")
      }

      const [reserve0Raw, reserve1Raw] = reservesResult.result as [bigint, bigint, bigint]
      const totalSupply = totalSupplyResult.result as bigint

      const token0Amount = toNumber(reserve0Raw, pool.token0.decimals)
      const token1Amount = toNumber(reserve1Raw, pool.token1.decimals)

      const price0Per1 =
        token0Amount > 0 && token1Amount > 0 ? token1Amount / token0Amount : null
      const price1Per1 =
        token0Amount > 0 && token1Amount > 0 ? token0Amount / token1Amount : null

      return {
        reserve0: reserve0Raw,
        reserve1: reserve1Raw,
        totalSupply,
        token0Amount,
        token1Amount,
        price0Per1,
        price1Per1,
      }
    },
  })

  if (shouldSkip) {
    return { data: undefined, isLoading: false, isError: false }
  }

  return {
    data: query.data as PoolOverview | undefined,
    isLoading: query.isLoading || query.isFetching,
    isError: Boolean(query.error),
  }
}

interface UseUserLiquidityParams {
  pool: PoolConfig | undefined
  account?: Address
}

export interface UserLiquidity {
  lpBalance: bigint
  sharePercent: number
  amount0: number
  amount1: number
}

interface UseUserLiquidityResult {
  data?: UserLiquidity
  isLoading: boolean
  isError: boolean
}

export function useUserLiquidity({
  pool,
  account,
}: UseUserLiquidityParams): UseUserLiquidityResult {
  const chainId = useChainId()
  const targetChainId = pool?.chainId ?? chainId
  const publicClient = usePublicClient({ chainId: targetChainId as any })
  const overview = usePoolOverview({ pool })

  const shouldSkip = !pool || !account

  const balanceQuery = useQuery({
    queryKey: ["user-liquidity", pool?.chainId, pool?.id, account],
    enabled: Boolean(!shouldSkip && publicClient),
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async () => {
      if (!pool || !account || !publicClient) return undefined
      return (await publicClient.readContract({
        address: pool.pairAddress,
        abi: uniswapV2PairAbi,
        functionName: "balanceOf",
        args: [account],
      })) as bigint
    },
  })

  if (shouldSkip) {
    return { data: undefined, isLoading: false, isError: false }
  }

  const hasOverview = overview.data && overview.data.totalSupply > BigInt(0)
  const lpBalance = balanceQuery.data ?? BigInt(0)

  const share =
    hasOverview && lpBalance > BigInt(0)
      ? Number(lpBalance) / Number(overview.data!.totalSupply)
      : 0

  const data: UserLiquidity | undefined =
    hasOverview && share > 0
      ? {
          lpBalance,
          sharePercent: share * 100,
          amount0: share * overview.data!.token0Amount,
          amount1: share * overview.data!.token1Amount,
        }
      : undefined

  return {
    data,
    isLoading:
      overview.isLoading || balanceQuery.isLoading || balanceQuery.isFetching,
    isError: overview.isError || Boolean(balanceQuery.error),
  }
}

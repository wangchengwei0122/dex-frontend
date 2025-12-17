"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import { formatUnits, type Address } from "viem"
import { getPoolsByChainId } from "@/config/pools"
import { getDexChainConfig } from "@/config/chains"
import type { TokenConfig } from "@/config/tokens"
import type { UserPoolPosition } from "./types"
import { uniswapV2PairAbi } from "@/lib/abi/uniswapV2Pair"

interface UseUserPoolsParams {
  chainId?: number
  account?: Address
}

interface UseUserPoolsResult {
  positions: UserPoolPosition[]
  isLoading: boolean
  isError: boolean
  error: Error | null
}

function normalizeTokenAddress(token?: TokenConfig): Address | undefined {
  if (!token) return undefined
  if (token.isNative || token.address === "native") {
    return token.wrappedAddress as Address | undefined
  }
  return token.address as Address
}

function formatTokenAmount(value: bigint, token: TokenConfig): string {
  const formatted = formatUnits(value, token.decimals)
  const numeric = Number(formatted)
  if (Number.isNaN(numeric)) return formatted
  const fixed = numeric >= 1 ? numeric.toFixed(4) : numeric.toFixed(6)
  return fixed.replace(/\.?0+$/, "") || "0"
}

export function useUserPools({ chainId, account }: UseUserPoolsParams): UseUserPoolsResult {
  const dexChainConfig = getDexChainConfig(chainId)
  const shouldQuery = Boolean(chainId && account && dexChainConfig)

  const publicClient = usePublicClient({ chainId })

  const pools = useMemo(
    () => (shouldQuery && chainId ? getPoolsByChainId(chainId) : []),
    [chainId, shouldQuery]
  )

  const enabled = Boolean(shouldQuery && publicClient && pools.length)

  const query = useQuery<UserPoolPosition[]>({
    queryKey: ["user-pools", chainId, account, pools.map((pool) => pool.id).join(",")],
    enabled,
    staleTime: 15_000,
    refetchInterval: 30_000,
    queryFn: async (): Promise<UserPoolPosition[]> => {
      if (!publicClient || !account || !chainId || !pools.length) return []

      const contracts = pools.flatMap((pool) => [
        { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "getReserves" } as const,
        { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "totalSupply" } as const,
        {
          address: pool.pairAddress,
          abi: uniswapV2PairAbi,
          functionName: "balanceOf",
          args: [account],
        } as const,
        { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "token0" } as const,
        { address: pool.pairAddress, abi: uniswapV2PairAbi, functionName: "token1" } as const,
      ])

      const { results } = await publicClient.multicall({
        allowFailure: true,
        contracts,
      })

      const positions: UserPoolPosition[] = []

      for (let i = 0; i < pools.length; i++) {
        const pool = pools[i]
        const [reservesResult, totalSupplyResult, balanceResult, token0Result, token1Result] =
          results.slice(i * 5, i * 5 + 5) || []

        if (
          !reservesResult ||
          reservesResult.status !== "success" ||
          !totalSupplyResult ||
          totalSupplyResult.status !== "success" ||
          !balanceResult ||
          balanceResult.status !== "success"
        ) {
          continue
        }

        const [reserve0Raw, reserve1Raw] = reservesResult.result
        const lpTotalSupply = totalSupplyResult.result as bigint
        const lpBalance = balanceResult.result as bigint

        if (lpBalance === BigInt(0) || lpTotalSupply === BigInt(0)) {
          continue
        }

        const configToken0Address = normalizeTokenAddress(pool.token0)?.toLowerCase()
        const configToken1Address = normalizeTokenAddress(pool.token1)?.toLowerCase()
        const onchainToken0 =
          token0Result && token0Result.status === "success"
            ? (token0Result.result as Address).toLowerCase()
            : undefined
        const onchainToken1 =
          token1Result && token1Result.status === "success"
            ? (token1Result.result as Address).toLowerCase()
            : undefined

        let token0Config = pool.token0
        let token1Config = pool.token1
        let reserve0 = reserve0Raw as bigint
        let reserve1 = reserve1Raw as bigint

        if (onchainToken0 && onchainToken1 && configToken0Address && configToken1Address) {
          const matchesConfig =
            onchainToken0 === configToken0Address && onchainToken1 === configToken1Address
          const matchesReversed =
            onchainToken0 === configToken1Address && onchainToken1 === configToken0Address

          if (matchesReversed) {
            token0Config = pool.token1
            token1Config = pool.token0
            reserve0 = reserve1Raw as bigint
            reserve1 = reserve0Raw as bigint
          } else if (!matchesConfig) {
            continue
          }
        }

        const pooledToken0Raw = (reserve0 * lpBalance) / lpTotalSupply
        const pooledToken1Raw = (reserve1 * lpBalance) / lpTotalSupply

        const shareScaled = (lpBalance * BigInt(1_000_000_000)) / lpTotalSupply
        const sharePercent = Number(shareScaled) / 10_000_000

        positions.push({
          poolId: pool.id,
          chainId: pool.chainId,
          pairAddress: pool.pairAddress,
          token0: token0Config,
          token1: token1Config,
          lpBalance,
          lpTotalSupply,
          sharePercent,
          reserve0,
          reserve1,
          pooledToken0: formatTokenAmount(pooledToken0Raw, token0Config),
          pooledToken1: formatTokenAmount(pooledToken1Raw, token1Config),
        })
      }

      return positions
    },
  })

  return {
    positions: shouldQuery ? query.data ?? [] : [],
    isLoading: shouldQuery ? query.isLoading || query.isFetching : false,
    isError: shouldQuery ? Boolean(query.error) : false,
    error: shouldQuery && query.error instanceof Error ? query.error : null,
  }
}

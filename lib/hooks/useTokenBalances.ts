import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useChainId, useConnection, usePublicClient } from 'wagmi'
import { formatUnits, erc20Abi } from 'viem'
import type { TokenConfig } from '@/config/tokens'

export interface UseTokenBalancesParams {
  tokens: TokenConfig[]
}

export interface TokenBalancesResult {
  isLoading: boolean
  data: Record<string, string> // key: token.address, value: 格式化后的余额字符串
}

/**
 * 获取多个 Token 的余额
 * 支持原生币（ETH）和 ERC20 Token
 * 使用 React Query + multicall 批量查询，避免多次 hook 调用
 */
export function useTokenBalances({ tokens }: UseTokenBalancesParams): TokenBalancesResult {
  const chainId = useChainId()
  const connection = useConnection()
  const address = connection.address
  const publicClient = usePublicClient({ chainId })

  // 过滤出当前链的 token
  const currentChainTokens = useMemo(
    () => tokens.filter((token) => token.chainId === chainId),
    [tokens, chainId]
  )

  // 查询余额
  const { data: balances, isLoading } = useQuery({
    queryKey: ['token-balances', chainId, address, currentChainTokens.map((t) => t.address).join(',')],
    queryFn: async () => {
      if (!address || !publicClient) {
        return {}
      }

      const balanceMap: Record<string, string> = {}

      // 批量查询余额
      const balancePromises = currentChainTokens.map(async (token) => {
        try {
          let balance: bigint

          if (token.isNative) {
            // 查询原生币余额
            const balanceResult = await publicClient.getBalance({ address })
            balance = balanceResult
          } else {
            // 查询 ERC20 余额
            balance = await publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [address],
            })
          }

          // 格式化余额
          const formatted = formatUnits(balance, token.decimals)
          const num = Number(formatted)
          // 保留合理的小数位数
          const displayValue = num < 0.000001 ? '0' : num.toFixed(6).replace(/\.?0+$/, '')
          balanceMap[token.address] = displayValue

          return { address: token.address, balance: displayValue }
        } catch (error) {
          // 查询失败时返回 0
          balanceMap[token.address] = '0'
          return { address: token.address, balance: '0' }
        }
      })

      await Promise.all(balancePromises)
      return balanceMap
    },
    enabled: !!address && !!publicClient && currentChainTokens.length > 0,
    staleTime: 10_000, // 10 秒缓存
    refetchInterval: 30_000, // 30 秒自动刷新
  })

  return {
    isLoading,
    data: balances || {},
  }
}


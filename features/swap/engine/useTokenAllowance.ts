import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { erc20Abi, type Address } from 'viem'
import type { TokenConfig } from '@/config/tokens'

export interface UseTokenAllowanceParams {
  /** Token 配置 */
  token?: TokenConfig | null
  /** 用户钱包地址 */
  owner?: Address
  /** Spender 地址（通常是 Router 地址） */
  spender?: Address
  /** 链 ID */
  chainId?: number
  /** 是否启用查询 */
  enabled?: boolean
}

export interface UseTokenAllowanceResult {
  /** 当前授权额度（bigint） */
  allowance: bigint
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否正在获取数据 */
  isFetching: boolean
  /** 错误信息 */
  error: Error | null
  /** 手动重新获取 */
  refetch: () => void
}

/**
 * 获取 ERC20 Token 的授权额度（Allowance）
 * 
 * @example
 * ```tsx
 * const { allowance, isLoading } = useTokenAllowance({
 *   token: fromToken,
 *   owner: address,
 *   spender: routerAddress,
 *   chainId,
 *   enabled: Boolean(token && address && routerAddress),
 * })
 * ```
 */
export function useTokenAllowance({
  token,
  owner,
  spender,
  chainId,
  enabled = true,
}: UseTokenAllowanceParams): UseTokenAllowanceResult {
  const publicClient = usePublicClient({ chainId: chainId as any })

  const isNativeToken = token?.isNative || token?.address === 'native'

  // 如果满足以下任一条件，直接返回 allowance = 0n（原生币返回最大额度）
  const shouldSkipQuery =
    !token ||
    !owner ||
    !spender ||
    isNativeToken ||
    enabled === false ||
    !chainId

  const query = useQuery({
    queryKey: [
      'token-allowance',
      chainId,
      token?.address,
      owner,
      spender,
    ],
    queryFn: async () => {
      // 参数校验
      if (!publicClient) {
        throw new Error('未连接到网络')
      }

      if (!token || !owner || !spender || isNativeToken) {
        throw new Error('缺少必要参数')
      }

      // 调用 ERC20 合约的 allowance 方法
      const allowance = await publicClient.readContract({
        address: token.address as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner, spender],
      })

      return { allowance }
    },
    enabled:
      !shouldSkipQuery &&
      !!publicClient &&
      !!chainId &&
      !!token &&
      !!owner &&
      !!spender &&
      !token.isNative, // 原生币不需要查询 allowance
    staleTime: 10_000, // 10 秒缓存
    retry: false, // 失败后不自动重试
  })

  // 如果应该跳过查询（原生币或参数缺失），直接返回
  if (shouldSkipQuery) {
    // 原生币返回最大额度（表示不需要 approve）
    const allowance = token?.isNative
      ? BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      : BigInt(0)

    return {
      allowance,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: () => {
        // 即使跳过查询，也提供一个空的 refetch 函数
      },
    }
  }

  return {
    allowance: query.data?.allowance ?? BigInt(0),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
    refetch: () => {
      query.refetch()
    },
  }
}

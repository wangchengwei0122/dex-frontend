import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { formatUnits, parseUnits, type Address } from 'viem'
import { useDebouncedValue } from './useDebouncedValue'
import { getUniswapV2RouterAddress, getWETHAddress } from '@/config/contracts'
import { uniswapV2RouterAbi } from '@/lib/abi/uniswapV2Router'
import type { Token } from '@/components/swap/types'

export interface UseSwapQuoteParams {
  /** 输入 Token */
  fromToken?: Token | null
  /** 输出 Token */
  toToken?: Token | null
  /** 输入金额（人类可读格式） */
  amountIn: string
  /** 当前链 ID */
  chainId?: number
  /** 是否启用查询（外部控制） */
  enabled?: boolean
}

export interface UseSwapQuoteResult {
  /** 输出金额（格式化后的人类可读值） */
  amountOutFormatted: string
  /** 原始输出金额（bigint） */
  rawAmountOut?: bigint
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否正在获取数据 */
  isFetching: boolean
  /** 错误信息 */
  error: Error | null
  /** 价格影响（百分比） */
  priceImpact?: number
}

/**
 * Swap 报价 Hook
 * 使用 Uniswap V2 Router 的 getAmountsOut 方法获取链上报价
 */
export function useSwapQuote({
  fromToken,
  toToken,
  amountIn,
  chainId,
  enabled = true,
}: UseSwapQuoteParams): UseSwapQuoteResult {
  const publicClient = usePublicClient({ chainId })
  
  // 对输入金额进行防抖处理，避免频繁请求
  const debouncedAmountIn = useDebouncedValue(amountIn, 400)

  const query = useQuery({
    queryKey: [
      'swap-quote',
      chainId,
      fromToken?.address,
      toToken?.address,
      debouncedAmountIn,
    ],
    queryFn: async () => {
      // 参数校验
      if (!publicClient) {
        throw new Error('未连接到网络')
      }

      if (!chainId) {
        throw new Error('未检测到链 ID')
      }

      if (!fromToken || !toToken) {
        throw new Error('请选择 Token')
      }

      if (!debouncedAmountIn || debouncedAmountIn === '0') {
        throw new Error('请输入金额')
      }

      const amountInNum = Number(debouncedAmountIn)
      if (isNaN(amountInNum) || amountInNum <= 0) {
        throw new Error('金额无效')
      }

      // 获取 Router 地址
      const routerAddress = getUniswapV2RouterAddress(chainId)
      if (!routerAddress) {
        throw new Error(`不支持的链 ID: ${chainId}`)
      }

      // 构建交易路径
      // 如果 token 是 ETH (0x0...)，需要使用 WETH 地址
      const wethAddress = getWETHAddress(chainId)
      const fromAddress = fromToken.address.toLowerCase().startsWith('0x0000000')
        ? wethAddress
        : (fromToken.address as Address)
      const toAddress = toToken.address.toLowerCase().startsWith('0x0000000')
        ? wethAddress
        : (toToken.address as Address)

      if (!fromAddress || !toAddress) {
        throw new Error('无法确定 Token 地址')
      }

      const path: Address[] = [fromAddress, toAddress]

      // 将输入金额转换为 wei
      let amountInWei: bigint
      try {
        amountInWei = parseUnits(debouncedAmountIn, fromToken.decimals)
      } catch (err) {
        throw new Error('金额格式错误')
      }

      // 调用链上合约获取报价
      try {
        const amounts = await publicClient.readContract({
          address: routerAddress,
          abi: uniswapV2RouterAbi,
          functionName: 'getAmountsOut',
          args: [amountInWei, path],
        })

        // amounts 是一个数组，amounts[0] 是输入金额，amounts[1] 是输出金额
        const amountOut = amounts[1]

        if (!amountOut || amountOut === 0n) {
          throw new Error('无法获取报价，可能池子流动性不足')
        }

        // 格式化输出金额
        const amountOutFormatted = formatUnits(amountOut, toToken.decimals)

        return {
          amountOutFormatted,
          rawAmountOut: amountOut,
        }
      } catch (err: any) {
        // 处理常见的链上错误
        if (err.message?.includes('INSUFFICIENT_LIQUIDITY')) {
          throw new Error('池子流动性不足，无法报价')
        }
        if (err.message?.includes('INSUFFICIENT_INPUT_AMOUNT')) {
          throw new Error('输入金额过小')
        }
        if (err.message?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
          throw new Error('输出金额过小')
        }
        if (err.message?.includes('execution reverted')) {
          throw new Error('交易对不存在或流动性不足')
        }
        
        // 其他错误
        throw new Error(err.message || '获取报价失败')
      }
    },
    enabled:
      enabled &&
      !!publicClient &&
      !!chainId &&
      !!fromToken &&
      !!toToken &&
      !!debouncedAmountIn &&
      Number(debouncedAmountIn) > 0 &&
      !isNaN(Number(debouncedAmountIn)),
    // 报价数据 30 秒后过期
    staleTime: 30_000,
    // 失败后不自动重试
    retry: false,
    // 数据过期后在后台自动重新获取
    refetchInterval: 30_000,
  })

  return {
    amountOutFormatted: query.data?.amountOutFormatted || '',
    rawAmountOut: query.data?.rawAmountOut,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
  }
}


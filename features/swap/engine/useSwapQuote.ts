import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import { formatUnits, parseUnits, type Address } from "viem"
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue"
import { getDexChainConfig } from "@/config/chains"
import { uniswapV2RouterAbi } from "@/lib/abi/uniswapV2Router"
import type { TokenConfig } from "@/config/tokens"

export interface UseSwapQuoteParams {
  /** 输入 Token */
  fromToken?: TokenConfig | null
  /** 输出 Token */
  toToken?: TokenConfig | null
  /** 输入金额（人类可读格式） */
  amountIn: string
  /** 滑点（基点） */
  slippageBps: number
  /** 当前链 ID */
  chainId?: number
  /** 是否启用查询（外部控制） */
  enabled?: boolean
}

export interface UseSwapQuoteResult {
  /** 输出金额（格式化后的人类可读值） */
  amountOutFormatted: string
  /** 原始输出金额（bigint） */
  amountOutWei?: bigint
  /** 滑点扣除后的最小接收金额（bigint） */
  amountOutMinWei?: bigint
  /** 最小接收金额（格式化） */
  amountOutMinFormatted: string
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否正在获取数据 */
  isFetching: boolean
  /** 错误信息 */
  error: Error | null
}

function applySlippage(amountOut: bigint, slippageBps: number): bigint {
  if (amountOut <= 0n) return 0n
  const bps = Math.min(Math.max(slippageBps, 0), 10000)
  return (amountOut * BigInt(10000 - bps)) / 10000n
}

/**
 * Swap 报价 Hook
 * 使用 Uniswap V2 Router 的 getAmountsOut 方法获取链上报价
 */
export function useSwapQuote({
  fromToken,
  toToken,
  amountIn,
  slippageBps,
  chainId,
  enabled = true,
}: UseSwapQuoteParams): UseSwapQuoteResult {
  const publicClient = usePublicClient()

  // 对输入金额进行防抖处理，避免频繁请求
  const debouncedAmountIn = useDebouncedValue(amountIn, 400)

  const query = useQuery({
    queryKey: ["swap-quote", chainId, fromToken?.address, toToken?.address, debouncedAmountIn],
    queryFn: async () => {
      // 参数校验
      if (!publicClient) {
        throw new Error("未连接到网络")
      }

      if (!chainId) {
        throw new Error("未检测到链 ID")
      }

      if (!fromToken || !toToken) {
        throw new Error("请选择 Token")
      }

      if (!debouncedAmountIn || debouncedAmountIn === "0") {
        throw new Error("请输入金额")
      }

      const amountInNum = Number(debouncedAmountIn)
      if (isNaN(amountInNum) || amountInNum <= 0) {
        throw new Error("金额无效")
      }

      // 获取 Router 地址
      const chainConfig = getDexChainConfig(chainId)
      const routerAddress = chainConfig?.routerAddress
      const wethAddress = chainConfig?.wethAddress

      if (!chainConfig || !routerAddress || !wethAddress) {
        throw new Error(`不支持的链 ID: ${chainId}`)
      }

      // 构建交易路径
      // 如果 token 是 ETH (0x0...)，需要使用 WETH 地址
      const isNative = (token: TokenConfig) =>
        token.isNative || token.address === "native" || token.address.toLowerCase().startsWith("0x0000000")

      const fromAddress = isNative(fromToken) ? wethAddress : (fromToken.address as Address)
      const toAddress = isNative(toToken) ? wethAddress : (toToken.address as Address)

      if (!fromAddress || !toAddress) {
        throw new Error("无法确定 Token 地址")
      }

      const path: Address[] = [fromAddress, toAddress]

      // 将输入金额转换为 wei
      let amountInWei: bigint
      try {
        amountInWei = parseUnits(debouncedAmountIn, fromToken.decimals)
      } catch {
        throw new Error("金额格式错误")
      }

      // 调用链上合约获取报价
      try {
        const amounts = await publicClient.readContract({
          address: routerAddress,
          abi: uniswapV2RouterAbi,
          functionName: "getAmountsOut",
          args: [amountInWei, path],
        })

        // amounts 是一个数组，amounts[0] 是输入金额，amounts[1] 是输出金额
        const amountOut = amounts[1]

        if (!amountOut || amountOut === 0n) {
          throw new Error("无法获取报价，可能池子流动性不足")
        }

        // 格式化输出金额
        const amountOutFormatted = formatUnits(amountOut, toToken.decimals)

        return {
          amountOutFormatted,
          amountOutWei: amountOut,
        }
      } catch (err: unknown) {
        // 处理常见的链上错误
        if (err instanceof Error && err.message?.includes("INSUFFICIENT_LIQUIDITY")) {
          throw new Error("池子流动性不足，无法报价")
        }
        if (err instanceof Error && err.message?.includes("INSUFFICIENT_INPUT_AMOUNT")) {
          throw new Error("输入金额过小")
        }
        if (err instanceof Error && err.message?.includes("INSUFFICIENT_OUTPUT_AMOUNT")) {
          throw new Error("输出金额过小")
        }
        if (err instanceof Error && err.message?.includes("execution reverted")) {
          throw new Error("交易对不存在或流动性不足")
        }

        // 其他错误
        const fallbackMessage = err instanceof Error ? err.message : "获取报价失败"
        throw new Error(fallbackMessage || "获取报价失败")
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

  const amountOutMinWei = query.data?.amountOutWei
    ? applySlippage(query.data.amountOutWei, slippageBps)
    : undefined

  const amountOutMinFormatted =
    amountOutMinWei && toToken ? formatUnits(amountOutMinWei, toToken.decimals) : ""

  return {
    amountOutFormatted: query.data?.amountOutFormatted || "",
    amountOutWei: query.data?.amountOutWei,
    amountOutMinWei,
    amountOutMinFormatted,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error as Error | null,
  }
}

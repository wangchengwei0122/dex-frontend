import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi'
import { parseUnits, type Address } from 'viem'
import { uniswapV2RouterAbi } from '@/lib/abi/uniswapV2Router'
import { getUniswapV2RouterAddress } from '@/config/contracts'
import type { TokenConfig } from '@/config/tokens'

export type SwapStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error'

export interface UseSwapParams {
  /** 输入 Token */
  fromToken?: TokenConfig | null
  /** 输出 Token */
  toToken?: TokenConfig | null
  /** 输入金额（人类可读字符串，例如 "0.1"） */
  amountIn: string
  /** 最小输出金额（人类可读字符串，例如 "352.45"） */
  amountOutMin: string
  /** 接收地址（默认用当前用户钱包地址） */
  recipient?: Address
  /** 交易截止时间（分钟），默认 20 分钟 */
  deadlineMinutes?: number
  /** 链 ID */
  chainId?: number
}

export interface UseSwapResult {
  /** 执行 swap 操作 */
  swap: () => Promise<void>
  /** 当前状态 */
  status: SwapStatus
  /** 是否处于空闲状态 */
  isIdle: boolean
  /** 是否正在准备交易 */
  isPreparing: boolean
  /** 是否正在等待交易确认 */
  isPending: boolean
  /** 最近一次交易是否成功 */
  isSuccess: boolean
  /** 最近一次交易是否失败 */
  isError: boolean
  /** 交易哈希 */
  txHash?: `0x${string}`
  /** 错误信息 */
  error: Error | null
}

/**
 * Swap 交易 Hook
 * 目前只支持 ERC20 → ERC20 的 swapExactTokensForTokens
 * 
 * @example
 * ```tsx
 * const { swap, status, isPending, isSuccess, error } = useSwap({
 *   fromToken,
 *   toToken,
 *   amountIn: fromAmount,
 *   amountOutMin: minAmountOut,
 *   recipient: address,
 *   deadlineMinutes: 20,
 *   chainId,
 * })
 * 
 * // 在按钮点击时调用
 * await swap()
 * ```
 */
export function useSwap({
  fromToken,
  toToken,
  amountIn,
  amountOutMin,
  recipient,
  deadlineMinutes = 20,
  chainId,
}: UseSwapParams): UseSwapResult {
  const [status, setStatus] = useState<SwapStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  // 获取 Router 地址
  const routerAddress = chainId ? getUniswapV2RouterAddress(chainId) : undefined

  // 计算数量（bigint）
  const amountInWei = (() => {
    if (!fromToken || !amountIn || amountIn === '0') return BigInt(0)
    try {
      const amountNum = Number(amountIn)
      if (isNaN(amountNum) || amountNum <= 0) return BigInt(0)
      return parseUnits(amountIn, fromToken.decimals)
    } catch {
      return BigInt(0)
    }
  })()

  const amountOutMinWei = (() => {
    if (!toToken || !amountOutMin || amountOutMin === '0') return BigInt(0)
    try {
      const amountNum = Number(amountOutMin)
      if (isNaN(amountNum) || amountNum <= 0) return BigInt(0)
      return parseUnits(amountOutMin, toToken.decimals)
    } catch {
      return BigInt(0)
    }
  })()

  // 构建交易路径（只支持直接路径，不考虑 WETH 中转）
  const path: Address[] | undefined = (() => {
    if (!fromToken || !toToken) return undefined
    // 只支持 ERC20 → ERC20，不考虑原生币
    if (fromToken.isNative || toToken.isNative) return undefined
    return [fromToken.address as Address, toToken.address as Address]
  })()

  // 计算 deadline（Unix 时间戳，秒）
  const deadline = Math.floor(Date.now() / 1000) + deadlineMinutes * 60

  // 前置校验：是否应该启用模拟和交易
  const shouldEnable = Boolean(
    fromToken &&
    toToken &&
    !fromToken.isNative &&
    !toToken.isNative &&
    amountInWei > 0n &&
    amountOutMinWei > 0n &&
    recipient &&
    routerAddress &&
    path &&
    chainId
  )

  // 模拟合约调用
  const { data: simulateData, isLoading: isSimulating } = useSimulateContract({
    address: routerAddress,
    abi: uniswapV2RouterAbi,
    functionName: 'swapExactTokensForTokens',
    args: path && recipient
      ? [amountInWei, amountOutMinWei, path, recipient, BigInt(deadline)]
      : undefined,
    chainId,
    query: {
      enabled: shouldEnable,
    },
  })

  // 写入合约
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  // 等待交易确认
  const {
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
    chainId,
  })

  // 更新交易哈希
  useEffect(() => {
    if (hash) {
      setTxHash(hash)
      setError(null) // 清除之前的错误
      setStatus('pending')
    }
  }, [hash])

  // 更新状态
  useEffect(() => {
    if (isSimulating && shouldEnable) {
      setStatus('preparing')
    } else if (isWritePending || isReceiptLoading) {
      setStatus('pending')
    } else if (isReceiptSuccess) {
      setStatus('success')
      setError(null)
    } else if (isWriteError || isReceiptError) {
      setStatus('error')
    } else if (!shouldEnable && status !== 'idle') {
      // 如果条件不满足，重置为空闲状态
      setStatus('idle')
    }
  }, [
    isSimulating,
    isWritePending,
    isReceiptLoading,
    isReceiptSuccess,
    isWriteError,
    isReceiptError,
    shouldEnable,
    status,
  ])

  // 更新错误状态
  useEffect(() => {
    if (isWriteError && writeError) {
      const errorMessage = writeError.message || '交易失败'
      // 处理用户拒绝交易的情况
      if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('user rejected') ||
        errorMessage.includes('rejected') ||
        errorMessage.includes('denied')
      ) {
        setError(new Error('用户拒绝了交易'))
      } else {
        setError(new Error(errorMessage))
      }
    } else if (isReceiptError && receiptError) {
      setError(new Error(receiptError.message || '交易确认失败'))
    } else if (isReceiptSuccess) {
      setError(null) // 成功时清除错误
    }
  }, [isWriteError, writeError, isReceiptError, receiptError, isReceiptSuccess])

  // 执行 swap 操作
  const swap = async (): Promise<void> => {
    // 前置校验
    if (
      !fromToken ||
      !toToken ||
      fromToken.isNative ||
      toToken.isNative ||
      amountInWei <= 0n ||
      amountOutMinWei <= 0n ||
      !recipient ||
      !routerAddress ||
      !path ||
      !chainId
    ) {
      return
    }

    // 重置状态
    setError(null)
    resetWrite()
    setStatus('preparing')

    // 检查是否有模拟数据
    if (!simulateData?.request) {
      setError(new Error('无法准备交易，请检查网络连接'))
      setStatus('error')
      return
    }

    try {
      // 发送交易（writeContract 是同步的，但会触发钱包弹窗）
      writeContract(simulateData.request)
      // 注意：writeContract 本身不会抛出异常，错误会通过 isWriteError 和 writeError 来处理
    } catch (err: any) {
      // 捕获同步错误（虽然 writeContract 通常不会抛出）
      const errorMessage = err.message || 'Swap 失败'
      if (
        errorMessage.includes('User rejected') ||
        errorMessage.includes('user rejected') ||
        errorMessage.includes('rejected') ||
        errorMessage.includes('denied')
      ) {
        setError(new Error('用户拒绝了交易'))
      } else {
        setError(new Error(errorMessage))
      }
      setStatus('error')
    }
  }

  return {
    swap,
    status,
    isIdle: status === 'idle',
    isPreparing: status === 'preparing',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    txHash,
    error,
  }
}


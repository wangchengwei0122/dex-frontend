import { useState, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi"
import { erc20Abi, maxUint256, type Address } from "viem"
import type { TokenConfig } from "@/config/tokens"

export interface UseTokenApprovalParams {
  /** Token 配置 */
  token?: TokenConfig | null
  /** 用户钱包地址 */
  owner?: Address
  /** Spender 地址（通常是 Router 地址） */
  spender?: Address
  /** 链 ID */
  chainId?: number
}

export interface UseTokenApprovalResult {
  /** 执行 approve 操作 */
  approveMax: () => Promise<void>
  /** 交易是否正在 pending */
  isPending: boolean
  /** 最近一次 approve 交易是否成功 */
  isSuccess: boolean
  /** 最近一次 approve 交易是否失败 */
  isError: boolean
  /** 错误信息 */
  error: Error | null
  /** 最近一笔交易哈希 */
  txHash?: `0x${string}`
}

/**
 * ERC20 Token 授权 Hook
 * 用于执行 approve 操作，授权 Router 合约使用用户的 Token
 *
 * @example
 * ```tsx
 * const { approveMax, isPending, isSuccess, error } = useTokenApproval({
 *   token: fromToken,
 *   owner: address,
 *   spender: routerAddress,
 *   chainId,
 * })
 *
 * // 在按钮点击时调用
 * await approveMax()
 * ```
 */
export function useTokenApproval({
  token,
  owner,
  spender,
  chainId,
}: UseTokenApprovalParams): UseTokenApprovalResult {
  const [error, setError] = useState<Error | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const isNativeToken = token?.isNative || token?.address === 'native'

  // 模拟合约调用
  const { data: simulateData } = useSimulateContract({
    address: token && !isNativeToken ? (token.address as Address) : undefined,
    abi: erc20Abi,
    functionName: "approve",
    args: spender ? [spender, maxUint256] : undefined,
    chainId,
    query: {
      enabled: Boolean(token && !isNativeToken && spender),
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
    }
  }, [hash])

  // 更新错误状态
  useEffect(() => {
    if (isWriteError && writeError) {
      const errorMessage = writeError.message || "交易失败"
      // 处理用户拒绝交易的情况
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected") ||
        errorMessage.includes("rejected") ||
        errorMessage.includes("denied")
      ) {
        setError(new Error("用户拒绝了交易"))
      } else {
        setError(new Error(errorMessage))
      }
    } else if (isReceiptError && receiptError) {
      setError(new Error(receiptError.message || "交易确认失败"))
    } else if (isReceiptSuccess) {
      setError(null) // 成功时清除错误
    }
  }, [isWriteError, writeError, isReceiptError, receiptError, isReceiptSuccess])

  // 执行 approve 操作
  const approveMax = async (): Promise<void> => {
    // 前置校验
    if (!token || isNativeToken || !spender) {
      return
    }

    // 重置状态
    setError(null)
    resetWrite()

    // 检查是否有模拟数据
    if (!simulateData?.request) {
      setError(new Error("无法准备交易，请检查网络连接"))
      return
    }

    try {
      // 发送交易（writeContract 是同步的，但会触发钱包弹窗）
      writeContract(simulateData.request)
      // 注意：writeContract 本身不会抛出异常，错误会通过 isWriteError 和 writeError 来处理
      // 如果用户拒绝交易，错误会在 useEffect 中被处理
    } catch (err: any) {
      // 捕获同步错误（虽然 writeContract 通常不会抛出）
      const errorMessage = err.message || "Approve 失败"
      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected") ||
        errorMessage.includes("rejected") ||
        errorMessage.includes("denied")
      ) {
        setError(new Error("用户拒绝了交易"))
      } else {
        setError(new Error(errorMessage))
      }
    }
  }

  const isPending = isWritePending || isReceiptLoading
  const isSuccess = isReceiptSuccess
  const isError = isWriteError || isReceiptError

  return {
    approveMax,
    isPending,
    isSuccess,
    isError,
    error,
    txHash,
  }
}

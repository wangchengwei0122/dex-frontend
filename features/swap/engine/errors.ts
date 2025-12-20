import type { TokenConfig } from "@/config/tokens"
import { SUPPORTED_CHAIN_IDS } from "@/config/chains"
import type { SwapStatus } from "./types"

export type SwapErrorCode =
  | "NONE"
  | "WALLET_DISCONNECTED"
  | "WRONG_NETWORK"
  | "NO_TOKENS_SELECTED"
  | "SAME_TOKENS"
  | "INVALID_AMOUNT"
  | "INSUFFICIENT_BALANCE"
  | "QUOTE_LOADING"
  | "QUOTE_FAILED"
  | "INSUFFICIENT_ALLOWANCE"
  | "SWAP_PREPARING"
  | "SWAP_PENDING"
  | "SWAP_FAILED"

export interface SwapError {
  code: SwapErrorCode
  /** UI 短文案（按钮/单行提示） */
  shortMessage: string
  /** 更详细的描述（底部提示/tooltip） */
  longMessage?: string
}

export const NO_ERROR: SwapError = {
  code: "NONE",
  shortMessage: "",
}

const SWAP_ERROR_MESSAGES: Record<
  SwapErrorCode,
  Pick<SwapError, "shortMessage" | "longMessage">
> = {
  NONE: { shortMessage: "", longMessage: "" },
  WALLET_DISCONNECTED: {
    shortMessage: "Connect wallet",
    longMessage: "Please connect your wallet to start swapping.",
  },
  WRONG_NETWORK: {
    shortMessage: "Wrong network",
    longMessage: "Please switch to a supported network to swap tokens.",
  },
  NO_TOKENS_SELECTED: {
    shortMessage: "Select a token",
    longMessage: "Please select both tokens before swapping.",
  },
  SAME_TOKENS: {
    shortMessage: "Tokens are the same",
    longMessage: "From and To tokens must be different.",
  },
  INVALID_AMOUNT: {
    shortMessage: "Enter an amount",
    longMessage: "Please enter a valid amount greater than zero.",
  },
  INSUFFICIENT_BALANCE: {
    shortMessage: "Insufficient balance",
    longMessage: "You do not have enough balance for this swap.",
  },
  QUOTE_LOADING: {
    shortMessage: "Fetching quote…",
    longMessage: "Fetching the best route and expected output.",
  },
  QUOTE_FAILED: {
    shortMessage: "Quote failed",
    longMessage: "Unable to get a quote for this pair. Liquidity may be insufficient.",
  },
  INSUFFICIENT_ALLOWANCE: {
    shortMessage: "Approve required",
    longMessage: "You need to approve this token before swapping.",
  },
  SWAP_PREPARING: {
    shortMessage: "Preparing swap…",
    longMessage: "Simulating transaction before sending.",
  },
  SWAP_PENDING: {
    shortMessage: "Swapping…",
    longMessage: "Your transaction is pending confirmation.",
  },
  SWAP_FAILED: {
    shortMessage: "Swap failed",
    longMessage: "The swap transaction failed. Please try again.",
  },
}

export function createSwapError(code: SwapErrorCode, override?: Partial<SwapError>): SwapError {
  const base = SWAP_ERROR_MESSAGES[code]
  return {
    code,
    shortMessage: override?.shortMessage ?? base.shortMessage,
    longMessage: override?.longMessage ?? base.longMessage,
  }
}

interface DeriveSwapErrorParams {
  // 钱包 / 网络
  isConnected: boolean
  chainId?: number
  supportedChainIds?: number[]

  // 表单（来自 useSwapForm）
  fromToken?: TokenConfig | null
  toToken?: TokenConfig | null
  fromAmount: string

  // 余额
  fromBalance?: bigint
  // quote
  quoteLoading: boolean
  quoteError?: Error | null

  // allowance / approve
  isNativeFromToken: boolean
  allowance?: bigint
  amountInWei?: bigint
  allowanceLoading: boolean

  // swap
  swapStatus: SwapStatus
  swapError?: Error | null
}

export function deriveSwapError(params: DeriveSwapErrorParams): SwapError {
  const {
    isConnected,
    chainId,
    supportedChainIds,
    fromToken,
    toToken,
    fromAmount,
    fromBalance,
    quoteLoading,
    quoteError,
    isNativeFromToken,
    allowance,
    amountInWei,
    allowanceLoading,
    swapStatus,
    swapError,
  } = params

  const allowedChainIds =
    supportedChainIds && supportedChainIds.length > 0 ? supportedChainIds : SUPPORTED_CHAIN_IDS
  const isSupportedChain = chainId !== undefined && allowedChainIds.includes(chainId)

  // 1) 钱包未连接
  if (!isConnected) {
    return createSwapError("WALLET_DISCONNECTED")
  }

  // 2) 网络不支持
  if (!isSupportedChain) {
    return createSwapError("WRONG_NETWORK")
  }

  // 3) Token 未选择 / 相同
  if (!fromToken || !toToken) {
    return createSwapError("NO_TOKENS_SELECTED")
  }
  if (fromToken.address === toToken.address) {
    return createSwapError("SAME_TOKENS")
  }

  // 4) 数量非法
  const amountStr = fromAmount?.trim()
  if (!amountStr) {
    return NO_ERROR
  }

  const hasInvalidAmount =
    !amountStr ||
    amountStr === "0" ||
    Number.isNaN(Number(amountStr)) ||
    Number(amountStr) <= 0 ||
    amountInWei === undefined ||
    amountInWei <= BigInt(0)
  if (hasInvalidAmount) {
    return createSwapError("INVALID_AMOUNT")
  }

  // 5) 余额不足（有余额数据且输入金额大于余额）
  if (fromBalance !== undefined && amountInWei > fromBalance) {
    return createSwapError("INSUFFICIENT_BALANCE")
  }

  // 6) 报价状态
  if (quoteLoading) {
    return createSwapError("QUOTE_LOADING")
  }
  if (quoteError) {
    const longMessage = quoteError.message
      ? `${SWAP_ERROR_MESSAGES.QUOTE_FAILED.longMessage} (${quoteError.message})`
      : SWAP_ERROR_MESSAGES.QUOTE_FAILED.longMessage
    return createSwapError("QUOTE_FAILED", { longMessage })
  }

  // 7) Allowance 不足（仅 ERC20，非原生）
  const needAllowanceCheck =
    !isNativeFromToken &&
    !allowanceLoading &&
    allowance !== undefined &&
    amountInWei !== undefined &&
    amountInWei > BigInt(0)
  if (needAllowanceCheck && allowance < amountInWei) {
    return createSwapError("INSUFFICIENT_ALLOWANCE")
  }

  // 8) Swap 状态
  if (swapStatus === "preparing") {
    return createSwapError("SWAP_PREPARING")
  }
  if (swapStatus === "pending") {
    return createSwapError("SWAP_PENDING")
  }
  if (swapStatus === "error") {
    const longMessage = swapError?.message
      ? `${SWAP_ERROR_MESSAGES.SWAP_FAILED.longMessage} (${swapError.message})`
      : SWAP_ERROR_MESSAGES.SWAP_FAILED.longMessage
    return createSwapError("SWAP_FAILED", { longMessage })
  }

  return NO_ERROR
}

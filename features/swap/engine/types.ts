import type { Address } from "viem"
import type { TokenConfig } from "@/config/tokens"

export type Side = "from" | "to"

export type SwapStatus = "idle" | "preparing" | "pending" | "success" | "error"

export interface SwapSettings {
  slippageBps: number
  deadlineMinutes: number
  oneClickEnabled: boolean
}

export interface SwapReviewParams {
  chainId: number
  fromToken: TokenConfig
  toToken: TokenConfig
  path: Address[]
  amountIn: bigint
  amountOutMin: bigint
  /** Unix timestamp (seconds) used by router */
  deadline: number
  /** Display-only deadline in minutes */
  deadlineMinutes: number
  humanAmountIn: string
  humanAmountOut: string
  humanAmountOutMin: string
  slippageBps: number
  recipient: Address
}

export interface UserPoolPosition {
  poolId: string
  chainId: number
  pairAddress: Address
  token0: TokenConfig
  token1: TokenConfig
  lpBalance: bigint
  lpTotalSupply: bigint
  sharePercent: number
  reserve0: bigint
  reserve1: bigint
  pooledToken0: string
  pooledToken1: string
}

// UI 侧使用 TokenConfig 作为 Token 类型，避免重复定义
export type Token = TokenConfig

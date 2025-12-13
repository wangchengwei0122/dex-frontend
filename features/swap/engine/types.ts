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
  deadline: number
  humanAmountIn: string
  humanAmountOut: string
  humanAmountOutMin: string
  slippageBps: number
  recipient: Address
}

// UI 侧使用 TokenConfig 作为 Token 类型，避免重复定义
export type Token = TokenConfig

export type Side = "from" | "to"

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export interface SwapSettings {
  slippageBps: number
  deadlineMinutes: number
  oneClickEnabled: boolean
}

export interface SwapReviewParams {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  settings: SwapSettings
}

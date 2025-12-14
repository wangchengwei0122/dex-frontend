import type { Address } from "viem"
import { MAINNET_TOKENS } from "./tokens/mainnet"
import { SEPOLIA_TOKENS } from "./tokens/sepolia"

/**
 * Token 配置接口
 */
export interface TokenConfig {
  chainId: number
  address: Address | "native" // ERC20 地址，原生币使用 0x0000...0000 或 'native'
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  isNative?: boolean // 原生币（ETH）标记
  wrappedAddress?: Address // 对应 WETH 地址（可选）
  priority?: number // 数字越小优先级越高
  isStable?: boolean // 稳定币标记
  tags?: string[]
}

/**
 * 根据 chainId 获取该链的 Token 列表
 */
export function getTokensByChainId(chainId: number): TokenConfig[] {
  const list = chainId === 1 ? MAINNET_TOKENS : chainId === 11155111 ? SEPOLIA_TOKENS : []
  return [...list].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
}

/**
 * 将 TokenConfig 转换为组件使用的 Token 类型
 */
export function tokenConfigToToken(config: TokenConfig) {
  return {
    address: config.address,
    symbol: config.symbol,
    name: config.name,
    decimals: config.decimals,
    logoURI: config.logoURI,
  }
}

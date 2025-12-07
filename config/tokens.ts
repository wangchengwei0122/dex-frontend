import type { Address } from 'viem'
import { MAINNET_TOKENS } from './tokens/mainnet'
import { SEPOLIA_TOKENS } from './tokens/sepolia'

/**
 * Token 配置接口
 */
export interface TokenConfig {
  chainId: number
  address: `0x${string}` // ERC20 地址，原生币使用 0x0000...0000
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  isNative?: boolean // 原生币（ETH）标记
  wrappedAddress?: `0x${string}` // 对应 WETH 地址（可选）
}

/**
 * 根据 chainId 获取该链的 Token 列表
 */
export function getTokensByChainId(chainId: number): TokenConfig[] {
  switch (chainId) {
    case 1:
      return MAINNET_TOKENS
    case 11155111:
      return SEPOLIA_TOKENS
    default:
      return []
  }
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


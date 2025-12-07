import type { TokenConfig } from '../tokens'

/**
 * Ethereum Mainnet Token 配置
 */
export const MAINNET_TOKENS: TokenConfig[] = [
  {
    chainId: 1,
    address: '0x0000000000000000000000000000000000000000', // 约定原生 ETH
    symbol: 'ETH',
    name: 'Ether',
    decimals: 18,
    isNative: true,
    wrappedAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Mainnet WETH
  },
  {
    chainId: 1,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    chainId: 1,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
  },
  {
    chainId: 1,
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
  },
]


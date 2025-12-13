import type { TokenConfig } from '../tokens'

/**
 * Ethereum Sepolia Testnet Token 配置
 */
export const SEPOLIA_TOKENS: TokenConfig[] = [
  {
    chainId: 11155111,
    address: '0x0000000000000000000000000000000000000000', // 约定原生 ETH
    symbol: 'ETH',
    name: 'Sepolia Ether',
    decimals: 18,
    isNative: true,
    wrappedAddress: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // Sepolia WETH
    priority: 1,
    tags: ['bluechip'],
  },
  {
    chainId: 11155111,
    address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    priority: 2,
    tags: ['bluechip'],
  },
  {
    chainId: 11155111,
    // USDC - Ethereum Sepolia（Circle 官方 & Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x1c7d4b196cb0c7b01d743fbc6116a902379c7238
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    priority: 3,
    isStable: true,
    tags: ['stable'],
  },
  {
    chainId: 11155111,
    // USDT - Ethereum Sepolia（Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0
    address: '0xaa8e23fb1079Ea71E0A56F48A2AA51851d8433d0',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    priority: 4,
    isStable: true,
    tags: ['stable'],
  },
  {
    chainId: 11155111,
    // WBTC - Ethereum Sepolia（Uniswap 上线）
    // https://app.uniswap.org/explore/tokens/ethereum_sepolia/0x52eea312378ef46140ebe67de8a143ba2304fd7c
    address: '0x52eEa312378Ef46140EBe67dE8A143ba2304fD7c',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    priority: 5,
    tags: ['bluechip'],
  },
]

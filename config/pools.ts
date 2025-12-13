import type { Address } from "viem"
import type { TokenConfig } from "@/config/tokens"
import { getTokensByChainId } from "@/config/tokens"

export interface PoolConfig {
  id: string
  chainId: number
  pairAddress: Address
  token0: TokenConfig
  token1: TokenConfig
  feeBps?: number
  priority?: number
}

export interface ChainPoolsConfig {
  chainId: number
  pools: PoolConfig[]
}

function findToken(tokens: TokenConfig[], symbol: string): TokenConfig {
  const token = tokens.find((item) => item.symbol === symbol)
  if (!token) {
    throw new Error(`Token ${symbol} not found in chain tokens`)
  }
  return token
}

const MAINNET_TOKENS = getTokensByChainId(1)
const SEPOLIA_TOKENS = getTokensByChainId(11155111)

const MAINNET_WETH = findToken(MAINNET_TOKENS, "WETH")
const MAINNET_USDC = findToken(MAINNET_TOKENS, "USDC")
const MAINNET_USDT = findToken(MAINNET_TOKENS, "USDT")
const MAINNET_WBTC = findToken(MAINNET_TOKENS, "WBTC")

const SEPOLIA_WETH = findToken(SEPOLIA_TOKENS, "WETH")
const SEPOLIA_USDC = findToken(SEPOLIA_TOKENS, "USDC")
const SEPOLIA_USDT = findToken(SEPOLIA_TOKENS, "USDT")
const SEPOLIA_WBTC = findToken(SEPOLIA_TOKENS, "WBTC")

export const CHAINS_POOLS: ChainPoolsConfig[] = [
  {
    chainId: 1,
    pools: [
      {
        id: "usdc-weth",
        chainId: 1,
        pairAddress: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc" as Address,
        token0: MAINNET_USDC,
        token1: MAINNET_WETH,
        feeBps: 30,
        priority: 1,
      },
      {
        id: "weth-usdt",
        chainId: 1,
        pairAddress: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852" as Address,
        token0: MAINNET_WETH,
        token1: MAINNET_USDT,
        feeBps: 30,
        priority: 2,
      },
      {
        id: "wbtc-weth",
        chainId: 1,
        pairAddress: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940" as Address,
        token0: MAINNET_WBTC,
        token1: MAINNET_WETH,
        feeBps: 30,
        priority: 3,
      },
    ],
  },
  {
    chainId: 11155111,
    pools: [
      {
        id: "usdc-weth",
        chainId: 11155111,
        pairAddress: "0x72e46e15ef83c896de44B1874B4AF7dDAB5b4F74" as Address,
        token0: SEPOLIA_USDC,
        token1: SEPOLIA_WETH,
        feeBps: 30,
        priority: 1,
      },
      {
        id: "usdt-weth",
        chainId: 11155111,
        pairAddress: "0xCBDB9cb0669906C8B12211824b4f069d183155Ff" as Address,
        token0: SEPOLIA_USDT,
        token1: SEPOLIA_WETH,
        feeBps: 30,
        priority: 2,
      },
      {
        id: "wbtc-weth",
        chainId: 11155111,
        pairAddress: "0x81e7162b97D8448b97760a8FD3fE8d17ea91d99c" as Address,
        token0: SEPOLIA_WBTC,
        token1: SEPOLIA_WETH,
        feeBps: 30,
        priority: 3,
      },
    ],
  },
]

export function getPoolsByChainId(chainId?: number): PoolConfig[] {
  if (!chainId) return []
  const item = CHAINS_POOLS.find((chain) => chain.chainId === chainId)
  if (!item) return []
  return [...item.pools].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
}

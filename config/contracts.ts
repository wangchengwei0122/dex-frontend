import type { Address } from 'viem'

/**
 * Uniswap V2 合约地址配置
 */
export const CONTRACTS = {
  sepolia: {
    ROUTER02: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3" as Address,
    FACTORY: "0xF62c03E08ada871A0bEb309762E260a7a6a880E6" as Address,
    WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" as Address, // Sepolia WETH
  },
  mainnet: {
    ROUTER02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" as Address,
    FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" as Address,
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address, // Mainnet WETH
  }
} as const

export type SupportedChainId = 1 | 11155111 // mainnet | sepolia

/**
 * 根据 chainId 获取 Uniswap V2 Router 地址
 */
export function getUniswapV2RouterAddress(chainId: number): Address | undefined {
  if (chainId === 1) return CONTRACTS.mainnet.ROUTER02
  if (chainId === 11155111) return CONTRACTS.sepolia.ROUTER02
  return undefined
}

/**
 * 根据 chainId 获取 WETH 地址
 */
export function getWETHAddress(chainId: number): Address | undefined {
  if (chainId === 1) return CONTRACTS.mainnet.WETH
  if (chainId === 11155111) return CONTRACTS.sepolia.WETH
  return undefined
}
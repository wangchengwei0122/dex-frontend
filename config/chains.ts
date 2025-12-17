import type { Address } from "viem"

export type SupportedChainId = 1 | 11155111 | 31337

export interface DexChainConfig {
  chainId: number
  name: string
  explorerBaseUrl: string
  routerAddress: Address
  wethAddress: Address
  nativeSymbol?: string
}

export const SUPPORTED_CHAINS: DexChainConfig[] = [
  {
    chainId: 1,
    name: "Ethereum",
    explorerBaseUrl: "https://etherscan.io",
    routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" as Address,
    wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
    nativeSymbol: "ETH",
  },
  {
    chainId: 11155111,
    name: "Sepolia",
    explorerBaseUrl: "https://sepolia.etherscan.io",
    routerAddress: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3" as Address,
    wethAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" as Address,
    nativeSymbol: "ETH",
  },
]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.chainId)

export const PREFERRED_CHAIN_ID = SUPPORTED_CHAIN_IDS.includes(11155111)
  ? 11155111
  : SUPPORTED_CHAIN_IDS[0]

export function getDexChainConfig(chainId?: number): DexChainConfig | undefined {
  if (!chainId) return undefined
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId)
}

export function getExplorerTxUrl(chainId: number, txHash: `0x${string}`): string | undefined {
  const chainConfig = getDexChainConfig(chainId)
  if (!chainConfig) return undefined
  return `${chainConfig.explorerBaseUrl}/tx/${txHash}`
}

export function toSupportedChainId(chainId?: number): SupportedChainId | undefined {
  if (chainId === 1 || chainId === 11155111 || chainId === 31337) return chainId
  return undefined
}

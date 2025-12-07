import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * 结合 clsx 和 tailwind-merge 的功能，用于条件性地合并类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据 chainId 获取区块浏览器交易链接
 * 
 * @param chainId 链 ID
 * @param txHash 交易哈希
 * @returns 区块浏览器链接，如果不支持的链则返回 undefined
 */
export function getExplorerTxUrl(chainId: number, txHash: `0x${string}`): string | undefined {
  switch (chainId) {
    case 1: // Mainnet
      return `https://etherscan.io/tx/${txHash}`
    case 11155111: // Sepolia
      return `https://sepolia.etherscan.io/tx/${txHash}`
    default:
      return undefined
  }
}

import type { PoolConfig } from "@/config/pools"
import type { TokenConfig } from "@/config/tokens"

// canonical 仅用于跨链资产身份识别，不影响合约交互或链上执行参数

/**
 * 获取 token 的资产身份标识
 * - 优先使用 canonical 指向的主网资产
 * - 否则使用当前链的 chainId + address
 */
export function getAssetIdentityKey(token: TokenConfig): string {
  if (token.canonical) {
    return `${token.canonical.chainId}:${token.canonical.address}`
  }
  return `${token.chainId}:${token.address}`
}

/**
 * 判断两个 token 是否是同一资产（基于 identity key）
 */
export function isSameAsset(a: TokenConfig, b: TokenConfig): boolean {
  return getAssetIdentityKey(a) === getAssetIdentityKey(b)
}

/**
 * 获取 pool 的资产身份标识（按 token identity 排序，得到稳定 key）
 */
export function getPoolIdentityKey(pool: PoolConfig): string {
  const keys = [getAssetIdentityKey(pool.token0), getAssetIdentityKey(pool.token1)].sort()
  return `${keys[0]}-${keys[1]}`
}

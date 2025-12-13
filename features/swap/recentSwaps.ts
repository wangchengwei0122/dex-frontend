import type { Address } from "viem"

export interface RecentSwap {
  id: string
  chainId: number
  account: Address
  timestamp: number
  txHash?: `0x${string}`

  fromTokenSymbol: string
  toTokenSymbol: string
  fromAmount: string
  toAmount: string

  status: "pending" | "success" | "error"
}

const STORAGE_KEY = "dex_recent_swaps_v1"

function loadRecentSwaps(): RecentSwap[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveRecentSwaps(list: RecentSwap[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)))
}

export function addRecentSwap(swap: RecentSwap) {
  const list = loadRecentSwaps()
  saveRecentSwaps([swap, ...list])
}

export function updateRecentSwapStatus(
  id: string,
  status: RecentSwap["status"],
  txHash?: RecentSwap["txHash"]
) {
  const list = loadRecentSwaps()
  const updated = list.map((item) =>
    item.id === id ? { ...item, status, txHash: txHash ?? item.txHash } : item
  )
  saveRecentSwaps(updated)
}

export function getRecentSwapsForAccount(chainId: number, account?: Address): RecentSwap[] {
  const list = loadRecentSwaps()
  if (!account) return list.filter((item) => item.chainId === chainId)
  return list.filter((item) => item.chainId === chainId && item.account === account)
}

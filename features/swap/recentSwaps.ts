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
const subscribers = new Set<() => void>()

let recentSwapsCache: RecentSwap[] | null = null
const filteredCache = new Map<string, RecentSwap[]>()

function notifySubscribers() {
  subscribers.forEach((listener) => listener())
}

export function subscribeRecentSwaps(listener: () => void) {
  subscribers.add(listener)
  return () => subscribers.delete(listener)
}

function loadRecentSwaps(): RecentSwap[] {
  if (recentSwapsCache) return recentSwapsCache
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    recentSwapsCache = []
    return recentSwapsCache
  }
  try {
    const data = JSON.parse(raw)
    recentSwapsCache = Array.isArray(data) ? data : []
    return recentSwapsCache
  } catch {
    recentSwapsCache = []
    return recentSwapsCache
  }
}

function saveRecentSwaps(list: RecentSwap[]) {
  if (typeof window === "undefined") return
  const next = list.slice(0, 20)
  recentSwapsCache = next
  filteredCache.clear()
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function addRecentSwap(swap: RecentSwap) {
  const list = loadRecentSwaps()
  saveRecentSwaps([swap, ...list])
  notifySubscribers()
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
  notifySubscribers()
}

export function getAllRecentSwapsSnapshot(): RecentSwap[] {
  return loadRecentSwaps()
}

export function getRecentSwapsForAccount(chainId: number, account?: Address): RecentSwap[] {
  const key = `${chainId}-${account ?? "all"}`
  const cached = filteredCache.get(key)
  if (cached) return cached

  const list = loadRecentSwaps()
  const filtered = list.filter((item) =>
    account ? item.chainId === chainId && item.account === account : item.chainId === chainId
  )
  filteredCache.set(key, filtered)
  return filtered
}

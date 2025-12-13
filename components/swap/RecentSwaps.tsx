import Link from "next/link"
import type { RecentSwap } from "@/features/swap/recentSwaps"

interface RecentSwapsProps {
  items: RecentSwap[]
  chainId?: number
  explorerBaseUrl?: string
}

function formatTime(timestamp: number) {
  const diffMs = Date.now() - timestamp
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const hours = Math.floor(diffMinutes / 60)
  return `${hours}h ago`
}

export function RecentSwaps({ items, explorerBaseUrl }: RecentSwapsProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Recent swaps</span>
        <span className="text-[11px] text-zinc-400">Last {Math.min(items.length, 8)} swaps</span>
      </div>

      {items.length === 0 ? (
        <div className="mt-3 text-xs text-zinc-500">No swaps yet.</div>
      ) : (
        <div className="mt-3 space-y-3">
          {items.slice(0, 8).map((item) => {
            const statusColor =
              item.status === "success"
                ? "bg-emerald-500"
                : item.status === "error"
                  ? "bg-red-500"
                  : "bg-amber-400"
            const explorerUrl =
              item.txHash && explorerBaseUrl ? `${explorerBaseUrl}/tx/${item.txHash}` : undefined

            return (
              <div key={item.id} className="flex items-start justify-between text-xs text-white">
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 rounded-full ${statusColor}`} />
                  <div>
                    <div className="font-medium">
                      {item.fromAmount} {item.fromTokenSymbol} → {item.toAmount} {item.toTokenSymbol}
                    </div>
                    <div className="text-[11px] text-zinc-400">{formatTime(item.timestamp)}</div>
                  </div>
                </div>

                {explorerUrl && (
                  <Link
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-zinc-300 hover:text-white"
                  >
                    ↗
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


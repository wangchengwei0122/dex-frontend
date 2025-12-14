"use client"

import { useCallback, useMemo, useSyncExternalStore, type CSSProperties } from "react"
import Image from "next/image"
import { useChainId } from "wagmi"
import { getTokensByChainId } from "@/config/tokens"

interface Bubble {
  id: string
  symbol: string
  logoURI?: string
  x: number
  y: number
  size: number
  dx: number
  dy: number
  rotateFrom: number
  rotateTo: number
  duration: number
  delay: number
}

export function FloatingTokens() {
  const chainId = useChainId()
  const isClient = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => typeof window !== "undefined",
    () => false
  )

  const bubbles = useMemo(() => {
    if (!isClient) return []

    const currentTokens = getTokensByChainId(chainId)
    if (!currentTokens.length) return []

    const baseSeed = chainId || 1
    const pseudoRandom = (offset: number) => {
      const x = Math.sin(baseSeed * 9973 + offset * 37) * 10000
      return x - Math.floor(x)
    }

    const randomized = currentTokens
      .map((token, index) => ({ token, score: pseudoRandom(index) }))
      .sort((a, b) => a.score - b.score)
      .map((item) => item.token)
    const count = Math.min(randomized.length, Math.floor(9 + pseudoRandom(1) * 2)) // 9-11 个

    const baseSize = 120
    const maxOffset = 24

    return randomized.slice(0, count).map((t, index) => {
      const randomSign = (offset: number) => (pseudoRandom(offset) > 0.5 ? 1 : -1)
      const dx = pseudoRandom(index * 5 + 2) * maxOffset * randomSign(index * 7 + 3)
      const dy = pseudoRandom(index * 5 + 4) * maxOffset * randomSign(index * 7 + 5)
      const rotateFrom = pseudoRandom(index * 11 + 1) * 8 * randomSign(index * 13 + 1)
      const rotateTo = pseudoRandom(index * 11 + 2) * 8 * randomSign(index * 13 + 3)

      return {
        id: `${t.symbol}-${index}`,
        symbol: t.symbol,
        logoURI: t.logoURI,
        x: 8 + pseudoRandom(index * 17 + 1) * 84, // 8% - 92% 之间
        y: 6 + pseudoRandom(index * 19 + 2) * 70, // 6% - 76% 之间
        size: baseSize,
        dx,
        dy,
        rotateFrom,
        rotateTo,
        duration: 18 + pseudoRandom(index * 23 + 3) * 12, // 18s - 30s
        delay: pseudoRandom(index * 29 + 4) * 8,
      }
    })
  }, [chainId, isClient])

  if (!bubbles.length) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bubbles.map((b) => (
        <TokenBubble key={b.id} bubble={b} />
      ))}
    </div>
  )
}

interface TokenBubbleProps {
  bubble: Bubble
}

function TokenBubble({ bubble }: TokenBubbleProps) {
  const style: CSSProperties = {
    width: bubble.size,
    height: bubble.size,
    left: `${bubble.x}%`,
    top: `${bubble.y}%`,
    animation: `dex-bubble-float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
    "--move-x": `${bubble.dx}px`,
    "--move-y": `${bubble.dy}px`,
    "--rotate-from": `${bubble.rotateFrom}deg`,
    "--rotate-to": `${bubble.rotateTo}deg`,
  }

  return (
    <div
      className="pointer-events-auto absolute flex items-center justify-center rounded-full shadow-[0_0_40px_rgba(0,0,0,0.45)] filter blur-sm opacity-70 transition-all duration-300 hover:blur-none hover:opacity-100 hover:scale-[1.73]"
      style={style}
    >
      {bubble.logoURI ? (
        <Image
          src={bubble.logoURI}
          alt={bubble.symbol}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-yellow-400/80 to-amber-500/80 text-sm font-semibold text-black">
          {bubble.symbol.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}

"use client"

import { useCallback, useMemo, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  revealDelay: number
}

interface FloatingTokensProps {
  entered?: boolean
}

export function FloatingTokens({ entered = true }: FloatingTokensProps) {
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

    const baseSize = 96
    const maxOffset = 12
    const zones = [
      { xMin: 4, xMax: 20, yMin: 12, yMax: 44 }, // 左上
      { xMin: 4, xMax: 20, yMin: 56, yMax: 86 }, // 左下
      { xMin: 80, xMax: 96, yMin: 12, yMax: 44 }, // 右上
      { xMin: 80, xMax: 96, yMin: 56, yMax: 86 }, // 右下
      { xMin: 26, xMax: 74, yMin: 6, yMax: 22 }, // 顶部横带
      { xMin: 26, xMax: 74, yMin: 78, yMax: 94 }, // 底部横带
    ]
    const placements: Array<{ x: number; y: number }> = []

    const isTooClose = (x: number, y: number) => {
      const minDistance = 13 // 单位是百分比，控制 token 之间的最小距离
      const minDistanceSq = minDistance * minDistance
      return placements.some((p) => {
        const dx = p.x - x
        const dy = p.y - y
        return dx * dx + dy * dy < minDistanceSq
      })
    }

    return randomized.slice(0, count).map((t, index) => {
      const randomSign = (offset: number) => (pseudoRandom(offset) > 0.5 ? 1 : -1)
      const dx = pseudoRandom(index * 5 + 2) * maxOffset * randomSign(index * 7 + 3)
      const dy = pseudoRandom(index * 5 + 4) * maxOffset * randomSign(index * 7 + 5)
      const rotateFrom = pseudoRandom(index * 11 + 1) * 8 * randomSign(index * 13 + 1)
      const rotateTo = pseudoRandom(index * 11 + 2) * 8 * randomSign(index * 13 + 3)
      const baseRevealDelay = index * 90
      const jitter = (pseudoRandom(index * 41 + 7) - 0.5) * 60 // -30ms ~ +30ms
      const revealDelay = Math.max(0, baseRevealDelay + jitter)
      const maxAttempts = 12

      const pickZone = (attempt: number) => {
        const zoneIndex = Math.floor(pseudoRandom(index * 31 + attempt * 7) * zones.length)
        return zones[zoneIndex]
      }

      let x = 8 + pseudoRandom(index * 17 + 1) * 84
      let y = 6 + pseudoRandom(index * 19 + 2) * 70

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const zone = pickZone(attempt)
        x = zone.xMin + pseudoRandom(index * 17 + 1 + attempt * 53) * (zone.xMax - zone.xMin)
        y = zone.yMin + pseudoRandom(index * 19 + 2 + attempt * 61) * (zone.yMax - zone.yMin)
        if (!isTooClose(x, y)) break
      }

      placements.push({ x, y })

      return {
        id: `${t.symbol}-${index}`,
        symbol: t.symbol,
        logoURI: t.logoURI,
        x,
        y,
        size: baseSize,
        dx,
        dy,
        rotateFrom,
        rotateTo,
        duration: 18 + pseudoRandom(index * 23 + 3) * 12, // 18s - 30s
        delay: pseudoRandom(index * 29 + 4) * 8,
        revealDelay,
      }
    })
  }, [chainId, isClient])

  if (!bubbles.length) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bubbles.map((b) => (
        <TokenBubble key={b.id} bubble={b} chainId={chainId} entered={entered} />
      ))}
    </div>
  )
}

interface TokenBubbleProps {
  bubble: Bubble
  chainId: number | undefined
  entered: boolean
}

type BubbleStyle = CSSProperties & {
  "--move-x"?: string
  "--move-y"?: string
  "--rotate-from"?: string
  "--rotate-to"?: string
  transitionDelay?: string
  transitionDuration?: string
}

function TokenBubble({ bubble, chainId, entered }: TokenBubbleProps) {
  const router = useRouter()

  const style: BubbleStyle = {
    width: bubble.size,
    height: bubble.size,
    left: `${bubble.x}%`,
    top: `${bubble.y}%`,
    animation: `dex-bubble-float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
    "--move-x": `${bubble.dx}px`,
    "--move-y": `${bubble.dy}px`,
    "--rotate-from": `${bubble.rotateFrom}deg`,
    "--rotate-to": `${bubble.rotateTo}deg`,
    transitionDelay: `${Math.round(bubble.revealDelay)}ms`,
    transitionDuration: "950ms",
  }

  const handleClick = () => {
    const chainParam = chainId?.toString() ?? "1"
    router.push(`/token/${chainParam}/${encodeURIComponent(bubble.symbol.toLowerCase())}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group pointer-events-auto absolute flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(0,0,0,0.45)] transition-all ease-[cubic-bezier(.18,1,.21,1)] hover:blur-none hover:opacity-100 hover:scale-[1.1] focus:outline-none focus:blur-none focus:opacity-100 focus:scale-[1.1] cursor-pointer ${
        entered ? "blur-sm opacity-70 translate-y-0 scale-100" : "blur-2xl opacity-0 translate-y-6 scale-90"
      }`}
      style={style}
    >
      {bubble.logoURI ? (
        <Image
          src={bubble.logoURI}
          alt={bubble.symbol}
          width={72}
          height={72}
          className="h-12 w-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.55]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-yellow-400/80 to-amber-500/80 text-sm font-semibold text-black transition-transform duration-300 group-hover:scale-[1.55]">
          {bubble.symbol.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}

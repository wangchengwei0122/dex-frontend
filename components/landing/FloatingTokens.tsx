"use client"

import { useEffect, useState, type CSSProperties } from "react"
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
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    const currentTokens = getTokensByChainId(chainId)
    if (!currentTokens.length) return

    const randomized = [...currentTokens].sort(() => Math.random() - 0.5)
    const count = Math.min(
      randomized.length,
      Math.floor(9 + Math.random() * 2) // 6-10 个
    )

    const baseSize = 120
    const maxOffset = 24

    const generated: Bubble[] = randomized.slice(0, count).map((t, index) => {
      const dx = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1)
      const dy = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1)
      const rotateFrom = Math.random() * 8 * (Math.random() > 0.5 ? 1 : -1)
      const rotateTo = Math.random() * 8 * (Math.random() > 0.5 ? 1 : -1)

      return {
        id: `${t.symbol}-${index}`,
        symbol: t.symbol,
        logoURI: (t as any).logoURI,
        x: 8 + Math.random() * 84, // 8% - 92% 之间
        y: 6 + Math.random() * 70, // 6% - 76% 之间
        size: baseSize,
        dx,
        dy,
        rotateFrom,
        rotateTo,
        duration: 18 + Math.random() * 12, // 18s - 30s
        delay: Math.random() * 8,
      }
    })

    setBubbles(generated)
  }, [chainId])

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
        <img
          src={bubble.logoURI}
          alt={bubble.symbol}
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

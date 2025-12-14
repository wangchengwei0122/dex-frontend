"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface TokenIconProps {
  symbol: string
  name?: string
  logoURI?: string
  size?: number
  className?: string
}

export function TokenIcon({ symbol, name, logoURI, size = 32, className }: TokenIconProps) {
  const [loadError, setLoadError] = useState(false)
  const initials = useMemo(() => symbol.slice(0, 2).toUpperCase(), [symbol])
  const dimension = `${size}px`
  const shouldShowFallback = loadError || !logoURI

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#C9A227] to-[#F6D27A] text-black shadow-[0_0_12px_rgba(201,162,39,0.25)]",
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      {shouldShowFallback ? (
        <span className="text-xs font-semibold leading-none">{initials}</span>
      ) : (
        <img
          src={logoURI}
          alt={name || symbol}
          className="h-full w-full object-cover"
          onError={() => setLoadError(true)}
        />
      )}
    </div>
  )
}

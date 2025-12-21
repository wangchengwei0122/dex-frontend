"use client"

import { BackgroundGradient } from "@/components/landing/BackgroundGradient"
import { FloatingTokens } from "@/components/landing/FloatingTokens"
import { PageFogOverlay } from "@/components/landing/PageFogOverlay"
import { SwapCard } from "@/components/swap"
import { usePageEnter } from "@/hooks/usePageEnter"

export default function HomePage() {
  const { hydrated, entered } = usePageEnter()

  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-50">
      {/* 底层彩色渐变 */}
      <BackgroundGradient />

      {/* 中层：浮动 token，置于雾罩上方 */}
      {hydrated && <FloatingTokens entered={entered} />}

      {/* 雾罩层：全屏毛玻璃效果 */}
      <PageFogOverlay />

      {/* 内容层：标题 + Swap，不被模糊 */}
      <section className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-4 py-16 md:py-24 space-y-10">
        <h1
          className={`text-center text-4xl md:text-6xl font-semibold tracking-tight transition-all duration-700 ease-out ${
            entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: entered ? "160ms" : "0ms" }}
        >
          Swap anytime, anywhere.
        </h1>

        <div
          className={`w-full transition-all duration-700 ease-out ${
            entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: entered ? "240ms" : "0ms" }}
        >
          <SwapCard />
          {/* 这里不传 defaultFromSymbol/defaultToSymbol，走 SwapCard 的默认逻辑 */}
        </div>
      </section>
    </div>
  )
}

import { BackgroundGradient } from "@/components/landing/BackgroundGradient"
import { FloatingTokens } from "@/components/landing/FloatingTokens"
import { PageFogOverlay } from "@/components/landing/PageFogOverlay"
import { SwapCard } from "@/components/swap"

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-50">
      {/* 底层彩色渐变 */}
      <BackgroundGradient />

      {/* 中层：浮动 token，置于雾罩上方 */}
      <FloatingTokens />

      {/* 雾罩层：全屏毛玻璃效果 */}
      <PageFogOverlay />

      {/* 内容层：标题 + Swap，不被模糊 */}
      <section className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-4 py-16 md:py-24 space-y-10">
        <h1 className="text-center text-4xl md:text-6xl font-semibold tracking-tight">
          Swap anytime, anywhere.
        </h1>

        <div className="w-full">
          <SwapCard />
          {/* 这里不传 defaultFromSymbol/defaultToSymbol，走 SwapCard 的默认逻辑 */}
        </div>
      </section>
    </div>
  )
}

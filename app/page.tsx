"use client"

import { SwapCard } from "@/components/swap"
import type { SwapReviewParams } from "@/features/swap/engine"

export default function Home() {
  const handleReview = (params: SwapReviewParams) => {
    console.log("Review Swap:", params)
    // 后续可以在这里打开确认弹窗或执行链上交易
  }

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
        <SwapCard onReview={handleReview} />
      </div>
    </div>
  )
}

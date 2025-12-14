import { Suspense } from "react"
import TradePage from "@/components/trade/TradePage"

export default function TradeRoute() {
  return (
    <Suspense fallback={null}>
      <TradePage />
    </Suspense>
  )
}

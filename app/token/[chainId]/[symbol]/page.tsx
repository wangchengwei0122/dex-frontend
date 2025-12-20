import { Suspense } from "react"
import { TokenDetailPage } from "@/features/token/TokenDetailPage"

interface TokenRoutePageProps {
  params: Promise<{
    chainId: string
    symbol: string
  }>
}

export default async function TokenRoutePage({ params }: TokenRoutePageProps) {
  const resolvedParams = await params

  return (
    <Suspense fallback={null}>
      <TokenDetailPage
        chainIdParam={resolvedParams.chainId}
        symbolParam={resolvedParams.symbol}
      />
    </Suspense>
  )
}

import { useMemo } from "react"
import { useReadContract } from "wagmi"
import { zeroAddress, type Address } from "viem"
import { getDexChainConfig, toSupportedChainId, type SupportedChainId } from "@/config/chains"
import type { TokenConfig } from "@/config/tokens"
import { uniswapV2RouterAbi } from "@/lib/abi/uniswapV2Router"
import { uniswapV2FactoryAbi } from "@/lib/abi/uniswapV2Factory"
import { uniswapV2PairAbi } from "@/lib/abi/uniswapV2Pair"

interface UsePairReservesParams {
  fromToken?: TokenConfig | null
  toToken?: TokenConfig | null
  chainId?: SupportedChainId
}

interface UsePairReservesResult {
  reserveIn?: bigint
  reserveOut?: bigint
  loading: boolean
  error: Error | null
}

export function usePairReserves(params: UsePairReservesParams): UsePairReservesResult {
  const { fromToken, toToken, chainId } = params
  const supportedChainId = toSupportedChainId(chainId)

  const dexChainConfig = getDexChainConfig(supportedChainId)
  const routerAddress = dexChainConfig?.routerAddress

  const normalizedFrom: Address | undefined = useMemo(() => {
    if (!fromToken) return undefined
    if (fromToken.isNative) return fromToken.wrappedAddress as Address | undefined
    if (fromToken.address === "native") return fromToken.wrappedAddress as Address | undefined
    return fromToken.address as Address
  }, [fromToken])

  const normalizedTo: Address | undefined = useMemo(() => {
    if (!toToken) return undefined
    if (toToken.isNative) return toToken.wrappedAddress as Address | undefined
    if (toToken.address === "native") return toToken.wrappedAddress as Address | undefined
    return toToken.address as Address
  }, [toToken])

  const canQuery = Boolean(supportedChainId && routerAddress && normalizedFrom && normalizedTo)

  const {
    data: factoryAddress,
    isLoading: factoryLoading,
    error: factoryError,
  } = useReadContract({
    address: routerAddress,
    abi: uniswapV2RouterAbi,
    functionName: "factory",
    chainId: supportedChainId,
    query: {
      enabled: canQuery,
    },
  })

  const hasFactory = factoryAddress && factoryAddress !== zeroAddress

  const {
    data: pairAddress,
    isLoading: pairLoading,
    error: pairError,
  } = useReadContract({
    address: hasFactory ? (factoryAddress as Address) : undefined,
    abi: uniswapV2FactoryAbi,
    functionName: "getPair",
    args: normalizedFrom && normalizedTo ? [normalizedFrom, normalizedTo] : undefined,
    chainId: supportedChainId,
    query: {
      enabled: Boolean(hasFactory && normalizedFrom && normalizedTo),
    },
  })

  const pair = pairAddress as Address | undefined
  const hasPair = pair && pair !== zeroAddress

  const {
    data: token0,
    isLoading: token0Loading,
    error: token0Error,
  } = useReadContract({
    address: hasPair ? pair : undefined,
    abi: uniswapV2PairAbi,
    functionName: "token0",
    chainId: supportedChainId,
    query: {
      enabled: Boolean(hasPair),
    },
  })

  const {
    data: token1,
    isLoading: token1Loading,
    error: token1Error,
  } = useReadContract({
    address: hasPair ? pair : undefined,
    abi: uniswapV2PairAbi,
    functionName: "token1",
    chainId: supportedChainId,
    query: {
      enabled: Boolean(hasPair),
    },
  })

  const {
    data: reserves,
    isLoading: reservesLoading,
    error: reservesError,
  } = useReadContract({
    address: hasPair ? pair : undefined,
    abi: uniswapV2PairAbi,
    functionName: "getReserves",
    chainId: supportedChainId,
    query: {
      enabled: Boolean(hasPair),
    },
  })

  const mapped = useMemo(() => {
    if (!hasPair || !token0 || !token1 || !reserves || !normalizedFrom || !normalizedTo) {
      return { reserveIn: undefined, reserveOut: undefined }
    }

    const [reserve0, reserve1] = reserves
    const isFromToken0 = token0.toLowerCase() === normalizedFrom.toLowerCase()
    return {
      reserveIn: isFromToken0 ? reserve0 : reserve1,
      reserveOut: isFromToken0 ? reserve1 : reserve0,
    }
  }, [hasPair, normalizedFrom, normalizedTo, reserves, token0, token1])

  const loading =
    factoryLoading || pairLoading || token0Loading || token1Loading || reservesLoading

  const error = (factoryError || pairError || token0Error || token1Error || reservesError) ?? null

  return {
    reserveIn: mapped.reserveIn,
    reserveOut: mapped.reserveOut,
    loading,
    error: error ? (error as Error) : null,
  }
}

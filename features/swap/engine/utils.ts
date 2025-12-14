export function calcPriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number {
  if (
    amountIn <= BigInt(0) ||
    amountOut <= BigInt(0) ||
    reserveIn <= BigInt(0) ||
    reserveOut <= BigInt(0) ||
    reserveOut <= amountOut
  ) {
    return 0
  }

  const priceBefore = Number(reserveOut) / Number(reserveIn)
  const priceAfter = Number(reserveOut - amountOut) / Number(reserveIn + amountIn)

  const impact = priceAfter === 0 ? 0 : (priceAfter - priceBefore) / priceBefore
  return Math.abs(impact) * 100
}

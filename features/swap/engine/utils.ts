export function calcPriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number {
  if (
    amountIn <= 0n ||
    amountOut <= 0n ||
    reserveIn <= 0n ||
    reserveOut <= 0n ||
    reserveOut <= amountOut
  ) {
    return 0
  }

  const priceBefore = Number(reserveOut) / Number(reserveIn)
  const priceAfter = Number(reserveOut - amountOut) / Number(reserveIn + amountIn)

  const impact = priceAfter === 0 ? 0 : (priceAfter - priceBefore) / priceBefore
  return Math.abs(impact) * 100
}

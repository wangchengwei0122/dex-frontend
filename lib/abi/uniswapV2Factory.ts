import { parseAbi } from "viem"

export const uniswapV2FactoryAbi = parseAbi([
  "function getPair(address tokenA, address tokenB) external view returns (address pair)",
])


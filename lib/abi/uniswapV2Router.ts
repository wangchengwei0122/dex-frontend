import { parseAbi } from 'viem'

/**
 * Uniswap V2 Router02 最小 ABI
 * 只包含报价所需的 getAmountsOut 函数
 */
export const uniswapV2RouterAbi = parseAbi([
  'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
])


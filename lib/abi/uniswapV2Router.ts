import { parseAbi } from 'viem'

/**
 * Uniswap V2 Router02 ABI
 * 包含报价和交易所需的函数
 */
export const uniswapV2RouterAbi = parseAbi([
  // 报价函数
  'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
  // Swap 函数 - ERC20 → ERC20
  'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)',
])


# Swap Quote 链上报价集成说明

## 概述

本项目已集成 Uniswap V2 链上报价功能，通过 `getAmountsOut` 方法实时从链上获取 swap 报价。

## 核心文件

### 1. 配置文件

**`config/contracts.ts`**
- 定义了 Mainnet 和 Sepolia 的 Uniswap V2 Router 地址
- 提供 `getUniswapV2RouterAddress(chainId)` 工具函数
- 提供 `getWETHAddress(chainId)` 获取 WETH 地址

### 2. ABI 定义

**`lib/abi/uniswapV2Router.ts`**
- 使用 viem 的 `parseAbi` 定义最小 ABI
- 只包含 `getAmountsOut` 函数，减少代码体积

### 3. Hooks

**`lib/hooks/useDebouncedValue.ts`**
- 通用防抖 Hook
- 默认延迟 400ms，避免频繁请求 RPC

**`lib/hooks/useSwapQuote.ts`**
- 核心报价 Hook
- 使用 React Query 管理链上读取
- 自动处理错误和边界情况
- 支持以下特性：
  - ✅ 防抖处理（400ms）
  - ✅ 自动重试和缓存（30 秒）
  - ✅ ETH/WETH 地址转换
  - ✅ 友好的错误提示
  - ✅ Loading 状态管理

### 4. UI 组件

**`components/swap/SwapCard.tsx`**
- 集成 `useSwapQuote` Hook
- 使用 wagmi v3 的 `useChainId` 和 `useConnections`
- 通过 `connections.length > 0` 判断钱包连接状态
- 自动将报价结果填充到 "To" 输入框
- 根据报价状态控制 Swap 按钮

**`components/swap/SwapFooter.tsx`**
- 显示实时汇率
- 显示 loading 状态（"Fetching quote..."）
- 显示错误信息

## 使用示例

### 在组件中使用 useSwapQuote

```typescript
import { useSwapQuote } from '@/lib/hooks/useSwapQuote'
import { useChainId } from 'wagmi'

function MySwapComponent() {
  const chainId = useChainId()
  
  const {
    amountOutFormatted,
    rawAmountOut,
    isLoading,
    isFetching,
    error,
  } = useSwapQuote({
    fromToken: myFromToken,
    toToken: myToToken,
    amountIn: "1.5", // 人类可读格式
    chainId,
    enabled: true,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>You will receive: {amountOutFormatted}</div>
}
```

## 支持的链

- ✅ Ethereum Mainnet (chainId: 1)
- ✅ Sepolia Testnet (chainId: 11155111)

如需添加其他链，在 `config/contracts.ts` 中添加对应的 Router 地址即可。

## 错误处理

Hook 会自动处理以下常见错误：

| 链上错误 | 友好提示 |
|---------|---------|
| `INSUFFICIENT_LIQUIDITY` | 池子流动性不足，无法报价 |
| `INSUFFICIENT_INPUT_AMOUNT` | 输入金额过小 |
| `INSUFFICIENT_OUTPUT_AMOUNT` | 输出金额过小 |
| `execution reverted` | 交易对不存在或流动性不足 |

## 性能优化

1. **防抖**：输入停止 400ms 后才发起请求
2. **缓存**：React Query 自动缓存 30 秒
3. **后台刷新**：每 30 秒自动刷新报价
4. **禁用重试**：报价失败不自动重试，避免浪费 RPC 请求

## 注意事项

1. **ETH vs WETH**：
   - 用户界面使用 ETH (0x0000...)
   - 链上调用自动转换为 WETH 地址

2. **精度处理**：
   - 输入使用 `parseUnits` 转换为 wei
   - 输出使用 `formatUnits` 转换为人类可读格式

3. **钱包连接**：
   - 只有在钱包连接后才启用报价
   - 使用 `enabled: isConnected` 控制

## 后续扩展

如果需要添加更多功能，可以考虑：

- [ ] 支持多跳路径（A -> B -> C）
- [ ] 显示价格影响（price impact）
- [ ] 支持 Uniswap V3
- [ ] 添加最优路径自动选择
- [ ] 集成多个 DEX 聚合报价


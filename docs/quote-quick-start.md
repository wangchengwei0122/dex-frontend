# Swap Quote 快速开始

## 🎯 实现效果

✅ 用户输入 From 金额后，自动从链上获取报价并填充到 To 金额  
✅ 支持 loading 状态显示 "Fetching quote..."  
✅ 友好的错误提示（流动性不足、交易对不存在等）  
✅ 400ms 防抖，避免频繁请求  
✅ 支持 Ethereum Mainnet 和 Sepolia 测试网

## 📁 新增文件

```
config/
  └── contracts.ts                          # ✅ 更新：添加 Router 地址和工具函数

lib/
  ├── abi/
  │   └── uniswapV2Router.ts               # 🆕 Uniswap V2 Router ABI
  └── hooks/
      ├── index.ts                         # 🆕 Hooks 导出
      ├── useDebouncedValue.ts             # 🆕 防抖 Hook
      └── useSwapQuote.ts                  # 🆕 报价 Hook（核心）

components/swap/
  ├── SwapCard.tsx                         # ✅ 更新：集成链上报价
  └── SwapFooter.tsx                       # ✅ 更新：显示 loading/error

docs/
  ├── quote-quick-start.md                 # 🆕 本文档
  └── swap-quote-integration.md            # 🆕 详细说明
```

## 🔑 核心代码

### 1. useSwapQuote Hook

最核心的 Hook，负责链上报价逻辑：

```typescript
// lib/hooks/useSwapQuote.ts
import { useQuery } from "@tanstack/react-query"
import { usePublicClient } from "wagmi"
import { useDebouncedValue } from "./useDebouncedValue"

export function useSwapQuote({ fromToken, toToken, amountIn, chainId, enabled = true }) {
  const publicClient = usePublicClient({ chainId })
  const debouncedAmountIn = useDebouncedValue(amountIn, 400)

  const query = useQuery({
    queryKey: ["swap-quote", chainId, fromToken?.address, toToken?.address, debouncedAmountIn],
    queryFn: async () => {
      // 调用 Router.getAmountsOut
      const amounts = await publicClient.readContract({
        address: routerAddress,
        abi: uniswapV2RouterAbi,
        functionName: "getAmountsOut",
        args: [amountInWei, path],
      })

      return {
        amountOutFormatted: formatUnits(amounts[1], toToken.decimals),
        rawAmountOut: amounts[1],
      }
    },
    enabled: enabled && !!fromToken && !!toToken && Number(debouncedAmountIn) > 0,
    staleTime: 30_000,
    retry: false,
  })

  return {
    amountOutFormatted: query.data?.amountOutFormatted || "",
    rawAmountOut: query.data?.rawAmountOut,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  }
}
```

### 2. SwapCard 集成

在 SwapCard 组件中使用：

```typescript
// components/swap/SwapCard.tsx
import { useState, useEffect } from "react"
import { useChainId, useConnections } from "wagmi"
import { useSwapQuote } from "@/lib/hooks/useSwapQuote"

export function SwapCard() {
  const chainId = useChainId()
  const connections = useConnections()
  const isConnected = connections.length > 0

  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  // 🔥 使用链上报价
  const {
    amountOutFormatted,
    isLoading: isLoadingQuote,
    isFetching: isFetchingQuote,
    error: quoteError,
  } = useSwapQuote({
    fromToken,
    toToken,
    amountIn: fromAmount,
    chainId,
    enabled: isConnected,
  })

  // 🔥 自动更新 toAmount
  useEffect(() => {
    if (amountOutFormatted) {
      setToAmount(amountOutFormatted)
    } else if (!fromAmount || !fromToken || !toToken) {
      setToAmount("")
    }
  }, [amountOutFormatted, fromAmount, fromToken, toToken])

  // 按钮状态逻辑
  const getButtonState = () => {
    if (!isConnected) return { canSubmit: false }
    if (isFetchingQuote) return { canSubmit: false }
    if (quoteError) return { canSubmit: false, errorMessage: quoteError.message }
    if (!toAmount) return { canSubmit: false, errorMessage: "No quote available" }
    return { canSubmit: true }
  }

  return (
    <AppPanel>
      <SwapTokenRow
        label="From"
        amount={fromAmount}
        onAmountChange={setFromAmount}
      />

      <SwapTokenRow
        label="To"
        amount={toAmount}
        readOnly
      />

      <SwapFooter
        rateText={getRateText()}
        isLoadingQuote={isFetchingQuote}
        quoteError={quoteError?.message}
      />

      <SwapActionButton {...getButtonState()} />
    </AppPanel>
  )
}
```

### 3. SwapFooter 显示状态

```typescript
// components/swap/SwapFooter.tsx
export function SwapFooter({ isLoadingQuote, quoteError, rateText }) {
  const renderRateInfo = () => {
    if (isLoadingQuote) {
      return (
        <span className="flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Fetching quote...</span>
        </span>
      )
    }

    if (quoteError) {
      return <span className="text-[var(--error-text)]">{quoteError}</span>
    }

    return <span>{rateText || '—'}</span>
  }

  return (
    <div className="flex items-center justify-between text-[11px]">
      {renderRateInfo()}
      <span>Slippage 0.30%</span>
    </div>
  )
}
```

## 🧪 测试流程

1. **连接钱包**
   - 确保连接到 Mainnet 或 Sepolia

2. **选择 Token 对**
   - From: ETH
   - To: USDC

3. **输入金额**
   - 输入 "1" ETH
   - 等待 400ms 防抖
   - 应该看到 "Fetching quote..."
   - 报价成功后，To 金额自动填充

4. **查看错误处理**
   - 选择不存在的交易对，查看错误提示
   - 输入超大金额，查看流动性不足提示

## 🔧 配置

### 添加新的链

编辑 `config/contracts.ts`：

```typescript
export const CONTRACTS = {
  // 添加 Base 链
  base: {
    ROUTER02: "0x..." as Address,
    FACTORY: "0x..." as Address,
    WETH: "0x..." as Address,
  },
  // ...其他链
}

export function getUniswapV2RouterAddress(chainId: number) {
  if (chainId === 8453) return CONTRACTS.base.ROUTER02
  // ...
}
```

## 📊 性能指标

| 指标     | 值    |
| -------- | ----- |
| 防抖延迟 | 400ms |
| 缓存时间 | 30秒  |
| 自动刷新 | 30秒  |
| 失败重试 | 禁用  |

## ⚠️ 已知限制

1. **仅支持直接路径**
   - 目前只支持 A -> B 的直接交易对
   - 不支持多跳路径（A -> WETH -> B）
   - 如果没有直接流动性池，会报错

2. **价格影响**
   - 暂未实现价格影响计算
   - 大额交易可能出现显著滑点

3. **最佳路径**
   - 未实现多个 DEX 聚合
   - 未实现 V2/V3 自动选择

## 🚀 后续优化

- [ ] 支持多跳路径（通过 WETH 中转）
- [ ] 计算并显示价格影响
- [ ] 集成 Uniswap V3
- [ ] 多 DEX 聚合报价
- [ ] 添加报价比较功能

## 📞 问题排查

### 报价一直 loading

- 检查钱包是否连接
- 检查网络是否正确
- 查看浏览器 Console 是否有 RPC 错误

### 报价失败

- 确认交易对存在流动性
- 尝试减少输入金额
- 切换到 Mainnet 测试

### 按钮一直禁用

- 检查是否有报价返回
- 查看 SwapFooter 是否显示错误信息
- 确认所有必填字段都已填写

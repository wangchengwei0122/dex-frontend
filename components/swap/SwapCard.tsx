"use client"

import { useState, useEffect } from "react"
import { AppPanel } from "@/components/app/app-panel"
import { SwapHeader } from "./SwapHeader"
import { SwapTokenRow } from "./SwapTokenRow"
import { SwapDirectionSwitch } from "./SwapDirectionSwitch"
import { SwapFooter } from "./SwapFooter"
import { SwapActionButton } from "./SwapActionButton"
import { TokenSelectDialog } from "./TokenSelectDialog"
import { SwapSettingsDialog } from "./SwapSettingsDialog"
import type { Token, Side, SwapSettings, SwapReviewParams } from "./types"

// Mock 数据
const MOCK_TOKENS: Token[] = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
  },
];

const MOCK_BALANCES: Record<string, number> = {
  ETH: 1.234,
  USDC: 5000.0,
  USDT: 2500.0,
  WBTC: 0.05,
};

const MOCK_RATES: Record<string, Record<string, number>> = {
  ETH: {
    USDC: 3524.5,
    USDT: 3524.5,
    WBTC: 0.055,
  },
  USDC: {
    ETH: 1 / 3524.5,
    USDT: 1.0,
    WBTC: 0.0000156,
  },
  USDT: {
    ETH: 1 / 3524.5,
    USDC: 1.0,
    WBTC: 0.0000156,
  },
  WBTC: {
    ETH: 1 / 0.055,
    USDC: 64090.0,
    USDT: 64090.0,
  },
};

export interface SwapCardProps {
  tokens?: Token[];
  defaultFromSymbol?: string;
  defaultToSymbol?: string;
  onReview?: (params: SwapReviewParams) => void;
}

export function SwapCard({
  tokens = MOCK_TOKENS,
  defaultFromSymbol = "ETH",
  defaultToSymbol = "USDC",
  onReview,
}: SwapCardProps) {
  // State
  const [fromToken, setFromToken] = useState<Token | null>(
    tokens.find(t => t.symbol === defaultFromSymbol) || null
  );
  const [toToken, setToToken] = useState<Token | null>(
    tokens.find(t => t.symbol === defaultToSymbol) || null
  );
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [balances] = useState(MOCK_BALANCES);
  const [settings, setSettings] = useState<SwapSettings>({
    slippageBps: 30,
    deadlineMinutes: 30,
    oneClickEnabled: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [tokenDialogSide, setTokenDialogSide] = useState<Side | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Calculate toAmount when fromAmount or tokens change
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount || fromAmount === "0") {
      setToAmount("");
      return;
    }

    const fromAmountNum = Number(fromAmount);
    if (isNaN(fromAmountNum)) {
      setToAmount("");
      return;
    }

    const rate = MOCK_RATES[fromToken.symbol]?.[toToken.symbol];
    if (rate) {
      const calculated = fromAmountNum * rate;
      setToAmount(calculated.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  // Handlers
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleOpenTokenDialog = (side: Side) => {
    setTokenDialogSide(side);
    setTokenDialogOpen(true);
  };

  const handleSelectToken = (side: Side, token: Token) => {
    if (side === "from") {
      setFromToken(token);
      // If same as toToken, clear toToken
      if (toToken?.address === token.address) {
        setToToken(null);
      }
    } else {
      setToToken(token);
      // If same as fromToken, clear fromToken
      if (fromToken?.address === token.address) {
        setFromToken(null);
      }
    }
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleReview = () => {
    if (!fromToken || !toToken || !fromAmount) return;

    const params: SwapReviewParams = {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      settings,
    };

    console.log("Swap Review Params:", params);
    onReview?.(params);
  };

  // Button state logic
  const getButtonState = () => {
    if (!isConnected) {
      return { canSubmit: false, errorMessage: undefined };
    }

    if (!fromToken || !toToken) {
      return { canSubmit: false, errorMessage: "Select tokens" };
    }

    if (!fromAmount || fromAmount === "0") {
      return { canSubmit: false, errorMessage: "Enter an amount" };
    }

    const fromAmountNum = Number(fromAmount);
    if (isNaN(fromAmountNum)) {
      return { canSubmit: false, errorMessage: "Invalid amount" };
    }

    const balance = balances[fromToken.symbol] || 0;
    if (fromAmountNum > balance) {
      return { canSubmit: false, errorMessage: "Insufficient balance" };
    }

    return { canSubmit: true, errorMessage: undefined };
  };

  const { canSubmit, errorMessage } = getButtonState();

  // Rate text
  const getRateText = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) {
      return undefined;
    }

    const rate = MOCK_RATES[fromToken.symbol]?.[toToken.symbol];
    if (!rate) return undefined;

    return `1 ${fromToken.symbol} ≈ ${rate.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 6 
    })} ${toToken.symbol}`;
  };

  return (
    <>
      <AppPanel variant="dark" className="space-y-6">
        <SwapHeader onOpenSettings={() => setSettingsDialogOpen(true)} />

        <div className="space-y-4">
          <SwapTokenRow
            side="from"
            label="From"
            token={fromToken}
            amount={fromAmount}
            balance={fromToken ? balances[fromToken.symbol] : undefined}
            onAmountChange={handleFromAmountChange}
            onClickToken={() => handleOpenTokenDialog("from")}
          />

          <SwapDirectionSwitch onSwitch={handleSwitch} />

          <SwapTokenRow
            side="to"
            label="To"
            token={toToken}
            amount={toAmount}
            balance={toToken ? balances[toToken.symbol] : undefined}
            readOnlyAmount={true}
            onClickToken={() => handleOpenTokenDialog("to")}
          />

          <SwapFooter
            fromToken={fromToken}
            toToken={toToken}
            rateText={getRateText()}
            slippageBps={settings.slippageBps}
          />

          <SwapActionButton
            isConnected={isConnected}
            canSubmit={canSubmit}
            errorMessage={errorMessage}
            onConnect={handleConnect}
            onReview={handleReview}
          />
        </div>
      </AppPanel>

      <TokenSelectDialog
        open={tokenDialogOpen}
        side={tokenDialogSide || "from"}
        tokens={tokens}
        selectedToken={tokenDialogSide === "from" ? fromToken : toToken}
        onClose={() => setTokenDialogOpen(false)}
        onSelectToken={handleSelectToken}
      />

      <SwapSettingsDialog
        open={settingsDialogOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsDialogOpen(false)}
      />
    </>
  )
}


"use client"

import { useState, useMemo } from "react"
import { AppDialog, AppDialogContent } from "@/components/app/app-dialog"
import { AppInput } from "@/components/app/app-input"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { TokenIcon } from "@/components/shared/token-icon"
import type { Side, Token } from "@/features/swap/engine"

export interface TokenSelectDialogProps {
  open: boolean;
  side: Side;
  tokens: Token[];
  selectedToken?: Token | null;
  otherSideToken?: Token | null;
  isSupportedChain: boolean;
  onClose: () => void;
  onSelectToken: (side: Side, token: Token) => void;
}

export function TokenSelectDialog({
  open,
  side,
  tokens,
  selectedToken,
  otherSideToken,
  isSupportedChain,
  onClose,
  onSelectToken,
}: TokenSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tokens;

    return tokens.filter((token) => {
      const symbolMatch = token.symbol.toLowerCase().includes(query);
      const nameMatch = token.name.toLowerCase().includes(query);
      return symbolMatch || nameMatch;
    });
  }, [tokens, searchQuery]);

  const handleSelect = (token: Token) => {
    if (otherSideToken && token.address === otherSideToken.address) return;
    onSelectToken(side, token);
    setSearchQuery("");
    onClose();
  };

  return (
    <AppDialog open={open} onOpenChange={onClose}>
      <AppDialogContent 
        title="Select a token" 
        size="md"
        className="max-h-[80vh]"
      >
        <div className="space-y-4">
          <AppInput
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            disabled={!isSupportedChain}
          />

          {!isSupportedChain ? (
            <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
              <div className="py-8 text-center text-sm text-zinc-400">
                Current network is not supported. Please switch to Ethereum Mainnet or Sepolia.
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
              {filteredTokens.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500">
                  No tokens found
                </div>
              ) : (
                filteredTokens.map((token) => {
                  const isSelected = selectedToken?.address === token.address;
                  const isBlocked = otherSideToken && otherSideToken.address === token.address;

                  return (
                    <button
                      key={token.address}
                      onClick={() => handleSelect(token)}
                      disabled={isBlocked}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 p-3 rounded-xl transition-colors text-left",
                        "hover:bg-[color:var(--black-700)]",
                        isSelected && "bg-[color:var(--black-700)] border border-[color:var(--gold-border)]",
                        isBlocked && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <TokenIcon
                          symbol={token.symbol}
                          name={token.name}
                          logoURI={token.logoURI}
                          size={32}
                          className="shadow-none"
                        />
                        <div className="text-left">
                          <div className="text-sm font-medium text-zinc-50">
                            {token.name}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isBlocked && (
                          <span className="text-[10px] text-red-300">Already selected on the other side</span>
                        )}
                        {isSelected && (
                          <Check className="h-4 w-4 text-[#C9A227]" />
                        )}
                        {!isBlocked && !isSelected && (
                          <span className="text-sm text-zinc-300">{token.symbol}</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </AppDialogContent>
    </AppDialog>
  )
}

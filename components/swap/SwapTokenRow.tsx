import { AppInput } from "@/components/app/app-input"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { AppButton } from "@/components/app/app-button"
import { ChevronDown } from "lucide-react"
import type { Side, Token } from "./types"

export interface SwapTokenRowProps {
  side: Side;
  label: string;
  token: Token | null;
  amount: string;
  balance?: number;
  readOnlyAmount?: boolean;
  onAmountChange?: (value: string) => void;
  onClickToken?: () => void;
}

export function SwapTokenRow({
  side,
  label,
  token,
  amount,
  balance,
  readOnlyAmount = false,
  onAmountChange,
  onClickToken,
}: SwapTokenRowProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange?.(value);
    }
  };

  const formatBalance = (bal?: number) => {
    if (bal === undefined) return '0.0';
    return bal.toFixed(4);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <AppFieldLabel className="mb-0 text-[11px] text-zinc-400">
          {label}
        </AppFieldLabel>
        <span className="text-[11px] text-amber-200/80">
          Balance: {formatBalance(balance)} {token?.symbol || ''}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <AppInput
          className="flex-1 text-lg font-medium"
          placeholder="0.0"
          value={amount}
          onChange={handleAmountChange}
          disabled={readOnlyAmount}
        />
        <AppButton
          variant="outline"
          size="sm"
          className="rounded-full bg-[#0A0A0C] text-[#C9A227] border border-[#f5c76a80] px-4 py-2 text-[13px] shadow-[0_0_18px_rgba(201,162,39,0.12)] hover:bg-black/60 min-w-[100px]"
          onClick={onClickToken}
        >
          <span className="flex items-center gap-1.5">
            {token?.symbol || 'Select'}
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </AppButton>
      </div>
    </div>
  )
}


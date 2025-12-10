import type { ChangeEvent, ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { AppButton } from "@/components/app/app-button"
import { AppFieldLabel } from "@/components/app/app-field-label"
import { AppInput } from "@/components/app/app-input"
import type { Side, Token } from "@/features/swap/engine"

export interface TokenAmountInputProps {
  side: Side
  label: ReactNode
  token: Token | null
  amount: string
  balance?: string
  readOnlyAmount?: boolean
  onAmountChange?: (value: string) => void
  onClickToken?: () => void
  onClickMax?: () => void
  extra?: ReactNode
}

export function TokenAmountInput({
  side,
  label,
  token,
  amount,
  balance,
  readOnlyAmount = false,
  onAmountChange,
  onClickToken,
  onClickMax,
  extra,
}: TokenAmountInputProps) {
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnlyAmount) return
    const value = event.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange?.(value)
    }
  }

  const balanceText = balance ?? "0.0"

  return (
    <div className="space-y-2" data-side={side}>
      <div className="flex items-center justify-between">
        <AppFieldLabel className="mb-0 text-[11px] text-zinc-400">{label}</AppFieldLabel>
        <div className="flex items-center gap-2 text-[11px] text-amber-200/80">
          <span>
            Balance: {balanceText} {token?.symbol || ""}
          </span>
          {onClickMax && !readOnlyAmount && (
            <button
              type="button"
              onClick={onClickMax}
              className="text-[11px] font-semibold text-[#f5c76a] hover:text-[#ffd88a]"
            >
              Max
            </button>
          )}
        </div>
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
            {token?.symbol || "Select"}
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </AppButton>
      </div>

      {extra ? <div className="text-xs text-amber-100/70">{extra}</div> : null}
    </div>
  )
}

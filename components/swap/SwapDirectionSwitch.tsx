import { AppButton } from "@/components/app/app-button"

export interface SwapDirectionSwitchProps {
  onSwitch: () => void;
}

export function SwapDirectionSwitch({ onSwitch }: SwapDirectionSwitchProps) {
  return (
    <div className="flex justify-center">
      <AppButton
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-full bg-black/40 text-[#C9A227] border border-[#C9A227]/30 hover:bg-black/50"
        onClick={onSwitch}
      >
        ⇅
      </AppButton>
    </div>
  )
}


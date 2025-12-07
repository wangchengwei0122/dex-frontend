import { AppButton } from "@/components/app/app-button"

export interface SwapHeaderProps {
  onOpenSettings: () => void;
}

export function SwapHeader({ onOpenSettings }: SwapHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="relative pb-2 text-sm font-medium text-white hover:text-[#C9A227] transition hover:shadow-[0_0_14px_rgba(201,162,39,0.2)]">
          Swap
          <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#C9A227]" />
        </button>
      </div>
      <AppButton 
        variant="ghost" 
        size="sm" 
        className="text-[#C9A227]"
        onClick={onOpenSettings}
      >
        ⚙️
      </AppButton>
    </div>
  )
}


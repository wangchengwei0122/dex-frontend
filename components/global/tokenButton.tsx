import { AppButton } from "@/components/app/app-button"
export const TokenButton = ({ label }: { label: string }) => (
  <AppButton
    variant="outline"
    size="sm"
    className="rounded-full bg-[#0A0A0C] text-[#C9A227] border border-[#f5c76a80] px-4 py-2 text-[13px] shadow-[0_0_18px_rgba(201,162,39,0.12)] hover:bg-black/60"
  >
    {label}
  </AppButton>
)

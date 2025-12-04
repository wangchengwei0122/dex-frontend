import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { PANEL_SHADOW } from "@/config/theme"

const panelVariants = cva("rounded-3xl p-6 transition-all duration-200 backdrop-blur-xl", {
  variants: {
    variant: {
      dark: "bg-[#020617] text-zinc-50 border border-amber-400/40 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ring-1 ring-amber-300/10",
      light: "bg-white/90 text-zinc-900 border border-amber-200/60 shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
      glass: "bg-white/80 text-zinc-900 border border-zinc-200/70 shadow-sm",
      subtle: "bg-white/70 text-zinc-900 border border-zinc-200/60 shadow-none",
      default: "bg-[#020617] text-zinc-50 border border-amber-400/40 shadow-[0_18px_45px_rgba(15,23,42,0.85)] ring-1 ring-amber-300/10",
      bordered: "bg-white/90 text-zinc-900 border border-amber-200/60 shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
      elevated: "bg-[#020617] text-zinc-50 border border-amber-400/50 shadow-[0_22px_55px_rgba(15,23,42,0.9)] ring-1 ring-amber-300/10",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
})

export interface AppPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const AppPanel = React.forwardRef<HTMLDivElement, AppPanelProps>(
  ({ className, variant, children, ...props }, ref) => {
    const resolvedVariant = variant ?? "dark"
    const style = resolvedVariant === "dark" || resolvedVariant === "elevated" || resolvedVariant === "default"
      ? { boxShadow: PANEL_SHADOW }
      : undefined

    return (
      <div
        ref={ref}
        className={cn(panelVariants({ variant: resolvedVariant }), className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AppPanel.displayName = "AppPanel"

export { AppPanel }

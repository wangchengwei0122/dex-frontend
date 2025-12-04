import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appBadgeVariants = cva(
  "rounded-full font-semibold transition-all duration-200 tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-700 border border-zinc-200",
        primary: "bg-[#0A0A0C] text-[#C9A227] border border-[#C9A227]/60 shadow-[0_0_12px_rgba(201,162,39,0.15)]",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        error: "bg-rose-50 text-rose-700 border border-rose-200",
        outline: "border border-[#C9A227]/60 text-[#C9A227] bg-transparent",
      },
      size: {
        sm: "h-6 px-2 text-[11px]",
        md: "h-7 px-2.5 text-xs",
        lg: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AppBadgeProps extends BadgeProps, VariantProps<typeof appBadgeVariants> {}

const AppBadge = React.forwardRef<HTMLSpanElement, AppBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(appBadgeVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
AppBadge.displayName = "AppBadge"

export { AppBadge, appBadgeVariants }

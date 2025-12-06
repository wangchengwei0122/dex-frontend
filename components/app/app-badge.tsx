import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type BadgeProps = React.ComponentProps<typeof Badge>

const appBadgeVariants = cva(
  "rounded-full font-semibold transition-all duration-200 tracking-tight",
  {
    variants: {
      variant: {
        // default: "bg-zinc-100 text-zinc-700 border border-zinc-200",

        default:"bg-[#101015] text-zinc-300 border border-zinc-700/80 shadow-[0_0_0_1px_rgba(10,10,15,0.9)]",

        primary:
          "bg-[#0A0A0C] text-[color:var(--gold)] border border-[#f5c76a80] shadow-[0_0_12px_rgba(201,162,39,0.15)]",
        // success: "bg-emerald-50 text-emerald-700 border border-emerald-200",

        success:"bg-emerald-500/10 text-emerald-200 border border-emerald-400/70",


        // warning: "bg-amber-50 text-amber-700 border border-amber-200",

        warning:"bg-amber-500/12 text-amber-200 border border-amber-400/70",
        // error: "bg-rose-50 text-rose-700 border border-rose-200",

        error:"bg-rose-500/10 text-rose-200 border border-rose-400/70",

        outline:
          "border border-[#f5c76a80] text-[color:var(--gold)] bg-transparent",
      },
      size: {
        sm: "h-7 px-3 text-[13px]",
        md: "h-8 px-3.5 text-[13px]",
        lg: "h-9 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AppBadgeProps
  extends Omit<BadgeProps, "variant">,
    VariantProps<typeof appBadgeVariants> {}

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

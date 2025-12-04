import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { GOLD_GLOW_SHADOW } from "@/config/theme"

const appButtonVariants = cva(
  "group inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,162,39,0.25)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 disabled:pointer-events-none disabled:opacity-60 border border-transparent shadow-sm",
  {
    variants: {
      variant: {
        primary: "bg-[#0A0A0C] text-zinc-50 shadow-[0_0_32px_rgba(201,162,39,0.28)] border border-[color:rgba(201,162,39,0.65)] hover:bg-zinc-900 hover:border-[#D4A017] hover:text-white active:translate-y-[0.5px] relative overflow-hidden",
        secondary: "bg-amber-50 text-zinc-900 border border-[color:rgba(201,162,39,0.35)] hover:bg-amber-100 hover:border-[color:rgba(201,162,39,0.55)]",
        ghost: "bg-transparent text-[var(--app-gold)] hover:bg-[rgba(12,12,14,0.05)] border-transparent",
        outline: "bg-transparent text-[var(--app-gold)] border border-[color:rgba(201,162,39,0.55)] hover:border-[var(--app-gold-hover)] hover:bg-[rgba(201,162,39,0.06)]",
        danger: "bg-rose-500 text-white border border-rose-500/80 hover:bg-rose-600",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface AppButtonProps
  extends Omit<ButtonProps, "variant" | "size">,
    VariantProps<typeof appButtonVariants> {
  loading?: boolean
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(appButtonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        style={
          variant === "primary"
            ? {
                boxShadow: GOLD_GLOW_SHADOW,
                backgroundImage:
                  "linear-gradient(120deg, rgba(201,162,39,0.5), rgba(201,162,39,0.05))",
              }
            : undefined
        }
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-200" />}
        {children}
      </Button>
    )
  }
)
AppButton.displayName = "AppButton"

export { AppButton, appButtonVariants }

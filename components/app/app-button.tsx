import * as React from "react"
import { Button } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { GOLD_GLOW_SHADOW } from "@/config/theme"

type ButtonProps = React.ComponentProps<typeof Button>

const appButtonVariants = cva(
  "group inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 disabled:pointer-events-none disabled:opacity-60 border border-transparent shadow-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--panel-bg-dark)] text-zinc-50 shadow-[var(--gold-glow-shadow)] border border-[color:var(--gold-border-strong)] hover:bg-zinc-900 hover:border-[color:var(--app-gold-hover)] hover:text-white active:translate-y-[0.5px] relative overflow-hidden",
        secondary:
          "bg-amber-50 text-zinc-900 border border-[color:var(--gold-border-soft)] hover:bg-amber-100 hover:border-[color:var(--gold-border-strong)]",
        ghost:
          "bg-transparent text-[var(--gold)] border border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[rgba(201,162,39,0.06)]",
        outline:
          "bg-transparent text-[var(--gold)] border border-[#C9A227]/60 hover:border-[#F6D27A] hover:bg-[rgba(201,162,39,0.10)]",
        // danger:"bg-[#b91c1c] text-rose-50 border border-rose-500/80 hover:bg-[#dc2626] hover:border-rose-400/90 shadow-[0_0_22px_rgba(185,28,28,0.45)]",
        // danger:"bg-[var(--error)] text-white border border-[var(--error-border)] shadow-[var(--error-glow)] hover:brightness-110",

        danger:"bg-[var(--error)] text-white border border-[color:var(--error-border)] shadow-[var(--error-glow)] hover:brightness-110",
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

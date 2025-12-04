import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { GOLD_GLOW_SHADOW } from "@/config/theme"

const appButtonVariants = cva(
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 disabled:pointer-events-none disabled:opacity-60 border border-transparent shadow-sm",
  {
    variants: {
      variant: {
        primary: "bg-[#020617] text-zinc-50 shadow-[0_0_18px_rgba(250,204,21,0.35)] hover:bg-zinc-900 hover:border-amber-400/70 active:translate-y-[0.5px]",
        secondary: "bg-amber-100 text-zinc-900 border border-amber-300/80 hover:bg-amber-200/90 hover:border-amber-400/60",
        ghost: "bg-transparent text-amber-500 hover:bg-zinc-900/5 border-transparent",
        outline: "bg-transparent text-amber-500 border border-amber-400/70 hover:bg-amber-50/40",
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
        style={variant === "primary" ? { boxShadow: GOLD_GLOW_SHADOW } : undefined}
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

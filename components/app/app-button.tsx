import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const appButtonVariants = cva(
  "rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary: "bg-[#111] dark:bg-[#1F1F1F] text-white hover:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a] active:scale-[0.98]",
        secondary: "bg-white/80 dark:bg-white/10 border border-black/5 text-foreground hover:bg-white/90 dark:hover:bg-white/15 active:scale-[0.98]",
        ghost: "hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15",
        danger: "bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
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
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    )
  }
)
AppButton.displayName = "AppButton"

export { AppButton, appButtonVariants }

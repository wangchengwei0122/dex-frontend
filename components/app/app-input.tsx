import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appInputVariants = cva(
  "rounded-xl border transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-1 bg-white/60 dark:bg-white/5 backdrop-blur-sm",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
      },
      error: {
        true: "border-red-400/50 bg-red-50/30 dark:bg-red-500/5 focus-visible:ring-red-400/20 focus-visible:border-red-400/70",
        false: "border-black/5 hover:border-black/10 focus-visible:border-black/20",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
)

export interface AppInputProps extends InputProps, VariantProps<typeof appInputVariants> {
  error?: boolean
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ className, size, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(appInputVariants({ size, error }), className)}
        aria-invalid={error}
        {...props}
      />
    )
  }
)
AppInput.displayName = "AppInput"

export { AppInput }

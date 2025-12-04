import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appInputVariants = cva(
  "rounded-xl border transition-all duration-200 ease-out bg-white/85 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,162,39,0.25)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  {
    variants: {
      size: {
        sm: "h-10 px-3.5 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
      },
      error: {
        true: "border-rose-400 bg-rose-50/60 text-rose-900 focus-visible:ring-rose-300/60 focus-visible:ring-offset-rose-50",
        false: "border-zinc-200 hover:border-[#C9A227] focus-visible:border-[#C9A227]",
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
        className={cn(
          "disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-zinc-400 disabled:border-zinc-200/70",
          appInputVariants({ size, error }),
          className
        )}
        aria-invalid={error}
        {...props}
      />
    )
  }
)
AppInput.displayName = "AppInput"

export { AppInput }

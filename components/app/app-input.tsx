import * as React from "react"
import { Input } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<typeof Input>

const appInputVariants = cva(
  // 深色玻璃输入框基底
  "rounded-xl border border-[color:var(--gold-border-strong)]  transition-all duration-200 ease-out bg-[color:var(--black-700)] text-zinc-100 placeholder:text-[color:var(--input-placeholder)] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_45px_rgba(0,0,0,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--black-900)]",
  {
    variants: {
      size: {
        sm: "h-10 px-3.5 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
      },
      error: {
        true:
          "border-[color:var(--error-border)] bg-[#111316] text-[color:var(--error-text)] placeholder:text-[color:var(--error)] focus-visible:ring-[rgba(249,112,102,0.45)] focus-visible:ring-offset-[color:var(--black-900)]",
        false:
          "border-[color:var(--gold)] hover:border-[color:var(--app-gold-hover)] focus-visible:border-[color:var(--app-gold-hover)]",
      },
    },
    defaultVariants: {
      size: "md",
      error: false,
    },
  }
)

export interface AppInputProps
  extends Omit<InputProps, "size">,
    VariantProps<typeof appInputVariants> {
  error?: boolean
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ className, size, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "disabled:cursor-not-allowed disabled:bg-[#18181b] disabled:text-zinc-500 disabled:border-zinc-700/80",
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

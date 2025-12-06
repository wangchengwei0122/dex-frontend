import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// const appInputVariants = cva(
//   "rounded-xl border transition-all duration-200 ease-out bg-white/6 text-zinc-900 placeholder:text-zinc-400 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_10px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(201,162,39,0.25)] focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_14px_rgba(0,0,0,0.12)]",
//   {
//     variants: {
//       size: {
//         sm: "h-10 px-3.5 text-sm",
//         md: "h-11 px-4 text-base",
//         lg: "h-12 px-5 text-base",
//       },
//       error: {
//         true: "border-rose-400 bg-rose-50/70 text-rose-900 focus-visible:ring-rose-300/60 focus-visible:ring-offset-rose-50",
//         false: "border-zinc-200 hover:border-[#C9A227] focus-visible:border-[#C9A227]",
//       },
//     },
//     defaultVariants: {
//       size: "md",
//       error: false,
//     },
//   }
// )


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

export interface AppInputProps extends InputProps, VariantProps<typeof appInputVariants> {
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

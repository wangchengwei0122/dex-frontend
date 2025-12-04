import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const AppFieldLabel = React.forwardRef<HTMLLabelElement, AppFieldLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-amber-400 align-middle">*</span>}
      </label>
    )
  }
)
AppFieldLabel.displayName = "AppFieldLabel"

export { AppFieldLabel }

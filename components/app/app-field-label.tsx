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
          "text-xs font-medium text-muted-foreground block mb-1.5",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )
  }
)
AppFieldLabel.displayName = "AppFieldLabel"

export { AppFieldLabel }

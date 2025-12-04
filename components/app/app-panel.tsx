import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated"
}

const AppPanel = React.forwardRef<HTMLDivElement, AppPanelProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-white/70 dark:bg-white/5 border border-black/5 shadow-sm backdrop-blur-md",
      bordered: "bg-white/70 dark:bg-white/5 border-2 border-black/10 shadow-sm backdrop-blur-md",
      elevated: "bg-white/80 dark:bg-white/10 border border-black/5 shadow-md backdrop-blur-md",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-4 transition-shadow duration-200",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AppPanel.displayName = "AppPanel"

export { AppPanel }

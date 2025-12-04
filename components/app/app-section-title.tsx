import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppSectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const AppSectionTitle = React.forwardRef<HTMLHeadingElement, AppSectionTitleProps>(
  ({ className, as: Component = "h3", children, ...props }, ref) => {
    const sizeClasses = {
      h1: "text-xl font-semibold",
      h2: "text-lg font-semibold",
      h3: "text-base font-semibold",
      h4: "text-sm font-semibold",
      h5: "text-xs font-semibold",
      h6: "text-xs font-medium",
    }

    return (
      <Component
        ref={ref}
        className={cn(
          "text-foreground leading-tight tracking-tight",
          sizeClasses[Component],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
AppSectionTitle.displayName = "AppSectionTitle"

export { AppSectionTitle }

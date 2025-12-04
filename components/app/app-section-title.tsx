import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppSectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  withDivider?: boolean
}

const AppSectionTitle = React.forwardRef<HTMLHeadingElement, AppSectionTitleProps>(
  ({ className, as: Component = "h3", withDivider = false, children, ...props }, ref) => {
    const sizeClasses = {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-base",
      h4: "text-sm",
      h5: "text-xs",
      h6: "text-xs",
    }

    return (
      <Component
        ref={ref}
        className={cn(
          "flex items-center gap-3 uppercase tracking-[0.22em] text-[12px] text-zinc-500 font-semibold",
          sizeClasses[Component],
          withDivider && "after:h-px after:flex-1 after:bg-amber-400/40 after:rounded-full",
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

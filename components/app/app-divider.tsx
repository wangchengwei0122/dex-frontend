import * as React from "react"
import { cn } from "@/lib/utils"

export interface AppDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const AppDivider = React.forwardRef<HTMLDivElement, AppDividerProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-[#C9A227]/40",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    )
  }
)
AppDivider.displayName = "AppDivider"

export { AppDivider }

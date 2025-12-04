import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appBadgeVariants = cva(
  "rounded-md font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-transparent",
        primary: "bg-primary/10 text-primary border-transparent",
        success: "bg-green-500/10 text-green-600 dark:text-green-400 border-transparent",
        warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-transparent",
        error: "bg-destructive/10 text-destructive border-transparent",
        outline: "border border-border text-foreground",
      },
      size: {
        sm: "h-5 px-1.5 text-xs",
        md: "h-6 px-2 text-sm",
        lg: "h-7 px-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AppBadgeProps extends BadgeProps, VariantProps<typeof appBadgeVariants> {}

const AppBadge = React.forwardRef<HTMLSpanElement, AppBadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(appBadgeVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
AppBadge.displayName = "AppBadge"

export { AppBadge, appBadgeVariants }


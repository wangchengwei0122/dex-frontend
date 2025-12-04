import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appCardVariants = cva(
  "rounded-2xl transition-all duration-200 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-white/70 dark:bg-white/5 border border-black/5 shadow-sm",
        bordered: "bg-white/70 dark:bg-white/5 border-2 border-black/10 shadow-sm",
        elevated: "bg-white/80 dark:bg-white/10 border border-black/5 shadow-md",
        flat: "bg-white/60 dark:bg-white/5 border border-black/5 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AppCardProps extends CardProps, VariantProps<typeof appCardVariants> {}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(appCardVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
AppCard.displayName = "AppCard"

const AppCardHeader = CardHeader
const AppCardTitle = CardTitle
const AppCardDescription = CardDescription
const AppCardContent = CardContent
const AppCardFooter = CardFooter

export {
  AppCard,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
  AppCardContent,
  AppCardFooter,
}

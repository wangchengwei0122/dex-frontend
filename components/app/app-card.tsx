import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appCardVariants = cva("rounded-2xl transition-all duration-200 backdrop-blur-xl text-zinc-900", {
  variants: {
    variant: {
      default: "bg-white/90 border border-zinc-200/80 shadow-sm",
      bordered: "bg-white/90 border border-amber-200/70 shadow-sm",
      elevated: "bg-white/95 border border-zinc-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.12)]",
      flat: "bg-white/75 border border-zinc-200/60 shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

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

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appCardVariants = cva("rounded-3xl transition-all duration-200 backdrop-blur-xl text-zinc-900", {
  variants: {
    variant: {
      default: "bg-white/90 border border-[#f5c76a3d] shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
      bordered: "bg-white/90 border border-[#f5c76a3d] shadow-[0_4px_20px_rgba(0,0,0,0.07)]",
      elevated: "bg-white/95 border border-[#f5c76a3d] shadow-[0_12px_32px_rgba(0,0,0,0.12)]",
      flat: "bg-white/75 border border-[#f5c76a3d] shadow-none",
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

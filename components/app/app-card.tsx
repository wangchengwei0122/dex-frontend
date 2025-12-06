import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, type CardProps } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appCardVariants = cva("rounded-3xl transition-all duration-200 backdrop-blur-xl text-zinc-100", {
  variants: {
    variant: {
      default: "bg-[#0A0A0C]/90 border border-[#C9A22733] shadow-[0_12px_32px_rgba(0,0,0,0.55)] text-zinc-100",
      bordered: "bg-[#111111]/85 border border-[#C9A22740] shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-zinc-100",
      elevated: "bg-[#0A0A0C]/95 border border-[#C9A22755] shadow-[0_18px_45px_rgba(0,0,0,0.7)] text-zinc-100",
      flat: "bg-[#111111]/70 border border-[#C9A22720] shadow-none text-zinc-200",
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

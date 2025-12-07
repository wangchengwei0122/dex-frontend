import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type SwitchProps = React.ComponentProps<typeof Switch>

const appSwitchVariants = cva(
  "transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--black-900)]",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-[#C9A227] data-[state=checked]:border-[#C9A227] data-[state=unchecked]:bg-zinc-700 data-[state=unchecked]:border-zinc-600",
        primary:
          "data-[state=checked]:bg-[#C9A227] data-[state=checked]:border-[#F6D27A] data-[state=checked]:shadow-[0_0_12px_rgba(201,162,39,0.35)] data-[state=unchecked]:bg-zinc-800 data-[state=unchecked]:border-zinc-700",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface AppSwitchProps
  extends Omit<SwitchProps, "size">, VariantProps<typeof appSwitchVariants> {}

const AppSwitch = React.forwardRef<HTMLButtonElement, AppSwitchProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Switch
        ref={ref}
        className={cn(appSwitchVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

AppSwitch.displayName = "AppSwitch"

export { AppSwitch, appSwitchVariants }

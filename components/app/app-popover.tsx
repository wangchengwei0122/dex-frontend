"use client"

import * as React from "react"
import {
  Popover as PopoverBase,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export const AppPopover = PopoverBase
export const AppPopoverTrigger = PopoverTrigger
export const AppPopoverAnchor = PopoverAnchor

export interface AppPopoverContentProps extends React.ComponentProps<typeof PopoverContent> {
  size?: "sm" | "md" | "lg"
}

const AppPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  AppPopoverContentProps
>(({ className, size = "md", align = "center", sideOffset = 8, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "rounded-xl border bg-[var(--panel-bg-dark)] text-[var(--gray-50)]",
        "shadow-[var(--panel-shadow-dark)]",
        "p-4 outline-none",
        size === "sm" && "w-64",
        size === "md" && "w-72",
        size === "lg" && "w-80",
        className
      )}
      style={{
        borderColor: "var(--panel-border-dark)",
      }}
      {...props}
    />
  )
})
AppPopoverContent.displayName = "AppPopoverContent"

export { AppPopoverContent }

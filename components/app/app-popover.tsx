"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import {
  Popover as PopoverBase,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export const AppPopover = PopoverBase
export const AppPopoverTrigger = PopoverTrigger
export const AppPopoverAnchor = PopoverAnchor

export interface AppPopoverContentProps
  extends React.ComponentProps<typeof PopoverPrimitive.Content> {
  size?: "sm" | "md" | "lg"
}

const AppPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  AppPopoverContentProps
>(({ className, size = "md", align = "center", sideOffset = 8, ...props }, ref) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 origin-[--radix-popover-content-transform-origin]",
          "rounded-xl border bg-[var(--panel-bg-dark)] text-[var(--gray-50)]",
          "shadow-[var(--panel-shadow-dark)]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
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
    </PopoverPrimitive.Portal>
  )
})
AppPopoverContent.displayName = "AppPopoverContent"

export { AppPopoverContent }


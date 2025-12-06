"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog as DialogBase,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const AppDialog = DialogBase
export const AppDialogTrigger = DialogTrigger
export const AppDialogHeader = DialogHeader
export const AppDialogTitle = DialogTitle
export const AppDialogDescription = DialogDescription
export const AppDialogFooter = DialogFooter
export const AppDialogClose = DialogClose

export interface AppDialogContentProps extends Omit<
  React.ComponentProps<typeof DialogPrimitive.Content>,
  "title" | "description"
> {
  size?: "sm" | "md" | "lg"
  hideCloseIcon?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
}

const AppDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
})
AppDialogOverlay.displayName = "AppDialogOverlay"

const AppDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  AppDialogContentProps
>(
  (
    { className, size = "md", hideCloseIcon = false, title, description, children, ...props },
    ref
  ) => {
    return (
      <DialogPrimitive.Portal>
        <AppDialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "rounded-3xl border bg-[var(--panel-bg-dark)] text-[var(--gray-50)]",
            "shadow-[var(--panel-shadow-elevated)]",
            "focus:outline-none duration-200",
            "px-6 py-6",
            size === "sm" && "max-w-md",
            size === "md" && "max-w-lg",
            size === "lg" && "max-w-2xl",
            className
          )}
          style={{
            borderColor: "var(--panel-border-dark)",
          }}
          {...props}
        >
          {(title || description) && (
            <DialogHeader className="mb-4 space-y-1 pb-3 border-b border-[var(--gold-divider)]">
              {title && (
                <DialogTitle className="text-lg font-semibold text-[var(--gray-50)]">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-sm text-[var(--gray-500)] mt-1">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          {title || description ? <div className="mt-4 space-y-4">{children}</div> : children}
          {!hideCloseIcon && (
            <DialogPrimitive.Close
              className={cn(
                "absolute top-4 right-4 rounded-full",
                "bg-[var(--black-800)]/60 hover:bg-[var(--black-700)]/80",
                "border border-[var(--gold-border-soft)] hover:border-[var(--gold-border-strong)]",
                "p-1.5 transition-all duration-200",
                "opacity-70 hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)] focus:ring-offset-2 focus:ring-offset-[var(--black-900)]"
              )}
            >
              <X className="size-4 text-[var(--gray-50)]" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
  }
)
AppDialogContent.displayName = "AppDialogContent"

export { AppDialogContent }

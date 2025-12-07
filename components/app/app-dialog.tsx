"use client"

import * as React from "react"
import {
  Dialog as DialogBase,
  DialogTrigger,
  DialogContent,
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

type DialogContentBaseProps = React.ComponentProps<typeof DialogContent>

export interface AppDialogContentProps extends Omit<
  DialogContentBaseProps,
  "title" | "description" | "showCloseButton"
> {
  size?: "sm" | "md" | "lg"
  /** 支持 ReactNode，而不是 shadcn 里原来的 string */
  title?: React.ReactNode
  description?: React.ReactNode
  /** 是否隐藏右上角的自定义关闭按钮 */
  hideCloseIcon?: boolean
}

const AppDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  AppDialogContentProps
>(
  (
    { className, size = "md", title, description, hideCloseIcon = false, children, ...props },
    ref
  ) => {
    return (
      <DialogContent
        ref={ref}
        // 关掉内部自带的关闭按钮，避免重复
        showCloseButton={false}
        {...props}
        className={cn(
          "rounded-3xl border bg-[var(--panel-bg-dark)] text-[var(--gray-50)]",
          "shadow-[var(--panel-shadow-dark)]",
          "border-[color:var(--panel-border-dark)]",
          "px-6 py-5 sm:px-7 sm:py-6",
          "focus:outline-none",
          size === "sm" && "sm:max-w-md",
          size === "md" && "sm:max-w-lg",
          size === "lg" && "sm:max-w-2xl",
          className
        )}
      >
        {(title || description || !hideCloseIcon) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <DialogTitle className="text-base font-semibold text-[var(--text-primary)]">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="mt-1 text-sm text-[var(--text-muted)]">
                  {description}
                </DialogDescription>
              )}
            </div>
            {!hideCloseIcon && (
              <DialogClose
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full",
                  "border border-[color:var(--panel-border-dark)]",
                  "bg-[color:var(--black-900)]/70 text-[var(--gray-300)]",
                  "hover:bg-[color:var(--black-800)] hover:text-[var(--gray-50)]",
                  "transition-colors"
                )}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </div>
        )}

        {children}
      </DialogContent>
    )
  }
)

AppDialogContent.displayName = "AppDialogContent"

export { AppDialogContent }

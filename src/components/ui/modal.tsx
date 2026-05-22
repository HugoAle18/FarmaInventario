"use client"

import { useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center"
      style={{ padding: "16px", paddingBottom: "80px" }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl w-full mx-lg max-h-[85vh] overflow-y-auto",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl"
        )}
      >
        <div className="flex items-center justify-between p-lg border-b border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-lg">{children}</div>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

export default function Select({
  options,
  value,
  onChange,
  className,
  placeholder,
}: {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "bg-surface border border-outline-variant rounded-lg px-md py-2 font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer hover:border-secondary transition-colors",
        className
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

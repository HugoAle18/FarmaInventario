"use client"

export default function SearchInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-secondary/50 rounded-lg transition-all">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        search
      </span>
      <input
        className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md focus:ring-0"
        placeholder={placeholder ?? "Buscar..."}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

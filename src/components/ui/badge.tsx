import { cn } from "@/lib/utils"
import type { StatusStock } from "@/types"

const statusStyles: Record<StatusStock, string> = {
  disponible:
    "bg-secondary/10 text-secondary border-secondary/20",
  stock_bajo:
    "bg-tertiary-fixed-dim/20 text-on-tertiary-container border-tertiary-fixed-dim/40",
  agotado:
    "bg-error-container text-on-error-container border-error/20",
  vence_pronto:
    "bg-orange-100 text-orange-700 border-orange-200",
}

const statusLabels: Record<StatusStock, string> = {
  disponible: "DISPONIBLE",
  stock_bajo: "STOCK BAJO",
  agotado: "AGOTADO",
  vence_pronto: "VENCE PRONTO",
}

export default function Badge({
  status,
  customLabel,
  customColor,
}: {
  status?: StatusStock
  customLabel?: string
  customColor?: string
}) {
  if (customLabel) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
          customColor
        )}
      >
        {customLabel}
      </span>
    )
  }

  const s = status ?? "disponible"

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
        statusStyles[s]
      )}
    >
      {statusLabels[s]}
    </span>
  )
}

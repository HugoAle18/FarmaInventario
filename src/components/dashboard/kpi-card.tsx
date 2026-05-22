import { cn } from "@/lib/utils"

export default function KpiCard({
  label,
  value,
  trend,
  icon,
  iconColor,
  borderColor,
  badge,
}: {
  label: string
  value: string | number
  trend?: string
  icon: string
  iconColor?: string
  borderColor?: string
  badge?: { text: string; className: string }
}) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow",
        borderColor
      )}
    >
      <div className="flex justify-between items-start mb-xs">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {label}
        </span>
        <span className={cn("material-symbols-outlined", iconColor)}>{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-headline-lg text-headline-lg">{value}</span>
        {trend && (
          <span className="text-[12px] text-secondary font-medium">{trend}</span>
        )}
        {badge && (
          <span
            className={cn(
              "text-[12px] px-xs py-[2px] rounded w-fit font-medium",
              badge.className
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", icon: "dashboard", label: "Home" },
  { href: "/productos", icon: "inventory_2", label: "Productos" },
  { href: "/stock", icon: "reorder", label: "Stock" },
  { href: "/alertas", icon: "notifications_active", label: "Alertas" },
  { href: "/configuracion", icon: "account_circle", label: "Perfil" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center h-20 px-xs z-50 lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive
                ? "text-secondary"
                : "text-on-surface-variant hover:text-primary transition-colors"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-label-caps">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

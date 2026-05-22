"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const mainItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/productos", icon: "inventory_2", label: "Productos" },
  { href: "/stock", icon: "reorder", label: "Stock" },
  { href: "/ventas", icon: "payments", label: "Ventas" },
]

const moreItems = [
  { href: "/proveedores", icon: "local_shipping", label: "Proveedores" },
  { href: "/reportes", icon: "analytics", label: "Reportes" },
  { href: "/configuracion", icon: "settings", label: "Configuración" },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1B2D] flex justify-around items-center h-16 px-xs z-50 lg:hidden border-t border-white/10">
        {mainItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 p-1 min-w-0 ${
                isActive ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center gap-0.5 p-1 min-w-0 ${
            moreOpen ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={moreOpen ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            more_horiz
          </span>
          <span className="text-[10px] font-medium">Más</span>
        </button>
      </nav>

      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="fixed bottom-16 left-0 right-0 z-50 lg:hidden rounded-t-2xl"
            style={{
              backgroundColor: "white",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="px-4 pb-6 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Más opciones</p>
              {moreItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                      isActive ? "bg-secondary/10 text-secondary font-semibold" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

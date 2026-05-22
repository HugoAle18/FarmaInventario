"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/productos", icon: "inventory_2", label: "Productos" },
  { href: "/stock", icon: "reorder", label: "Stock" },
  { href: "/proveedores", icon: "local_shipping", label: "Proveedores" },
  { href: "/ventas", icon: "payments", label: "Ventas" },
  { href: "/reportes", icon: "analytics", label: "Reportes" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary-container flex-col py-lg z-50 hidden lg:flex">
      <div className="px-lg mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-on-primary">
          FarmaInventario
        </h1>
        <p className="font-body-md text-body-md text-on-primary-container">
          Pharmacy Management
        </p>
      </div>
      <nav className="flex flex-col gap-xs flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-md px-md py-sm transition-all active:scale-95 ${
                isActive
                  ? "border-l-4 border-secondary bg-secondary/10 text-secondary font-bold"
                  : "text-on-primary-container/70 hover:text-on-primary hover:bg-on-primary-fixed-variant/10 transition-colors duration-200"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          )
        })}
        <div className="mt-auto">
          <Link
            href="/configuracion"
            className={`flex items-center gap-md px-md py-sm transition-all active:scale-95 ${
              pathname === "/configuracion"
                ? "border-l-4 border-secondary bg-secondary/10 text-secondary font-bold"
                : "text-on-primary-container/70 hover:text-on-primary hover:bg-on-primary-fixed-variant/10 transition-colors duration-200"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Configuración</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}

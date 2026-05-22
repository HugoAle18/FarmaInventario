"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TopAppBar() {
  const pathname = usePathname()

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/productos": "Productos",
    "/stock": "Stock",
    "/proveedores": "Proveedores",
    "/ventas": "Ventas",
    "/reportes": "Reportes",
    "/alertas": "Alertas",
    "/configuracion": "Configuración",
    "/usuarios": "Usuarios",
  }

  const title = pageTitles[pathname] || "FarmaInventario"

  return (
    <header className="flex justify-between items-center h-16 px-lg bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-md w-full max-w-md">
        <div className="relative w-full focus-within:ring-2 focus-within:ring-secondary/50 rounded-lg">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg py-xs pl-xl pr-md text-body-md focus:ring-0"
            placeholder={`Buscar en ${title.toLowerCase()}...`}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-lg">
        <Link
          href="/alertas"
          className="relative p-xs hover:bg-surface-container-low transition-colors rounded-full text-on-surface-variant"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </Link>
        <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low transition-colors p-xs rounded-lg">
          <div className="text-right hidden sm:block">
            <p className="font-label-caps text-label-caps text-primary">Dr. Sanchez</p>
            <p className="text-[10px] text-on-surface-variant">Administrador</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

import { getProveedores } from "@/lib/supabase/queries"
import Link from "next/link"

export default async function ProveedoresPage() {
  let proveedores: any[] = []

  try {
    proveedores = await getProveedores()
  } catch {}

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div className="space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary">Proveedores</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Laboratorios y distribuidoras registrados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {proveedores.map((p) => (
          <div
            key={p.id}
            className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-md mb-md">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{p.nombre}</h3>
                {p.contacto && (
                  <p className="font-body-md text-body-md text-on-surface-variant">{p.contacto}</p>
                )}
              </div>
            </div>
            <div className="space-y-xs">
              {p.telefono && (
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">phone</span>
                  <span className="font-body-md text-body-md">{p.telefono}</span>
                </div>
              )}
              {p.email && (
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span className="font-body-md text-body-md">{p.email}</span>
                </div>
              )}
              {p.direccion && (
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span className="font-body-md text-body-md">{p.direccion}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {proveedores.length === 0 && (
          <div className="col-span-full text-center py-xl text-on-surface-variant font-body-md">
            No hay proveedores registrados.
          </div>
        )}
      </div>
    </>
  )
}

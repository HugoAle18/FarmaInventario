"use client"

import { useState } from "react"
import Modal from "@/components/ui/modal"
import { crearProveedor, actualizarProveedor, eliminarProveedor } from "@/app/actions/proveedores"

export default function ProveedoresClient({ proveedores }: { proveedores: any[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(p: any) {
    setEditing(p)
    setModalOpen(true)
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar proveedor "${nombre}"?`)) return
    try {
      await eliminarProveedor(id)
    } catch {
      alert("Error al eliminar")
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Proveedores</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Gestión de laboratorios y distribuidoras.</p>
        </div>
        <button onClick={openCreate} className="bg-secondary text-on-secondary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          Agregar Proveedor
        </button>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">Nombre</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">RUC</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">Contacto</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">Teléfono</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">Email</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase">Estado</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {proveedores.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm font-body-md font-semibold text-on-surface">{p.nombre}</td>
                  <td className="px-md py-sm font-label-technical text-label-technical text-on-surface-variant mono-font">{p.ruc || "-"}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{p.contacto || "-"}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{p.telefono || "-"}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{p.email || "-"}</td>
                  <td className="px-md py-sm">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${p.activo !== false ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-error-container text-on-error-container border-error/20"}`}>
                      {p.activo !== false ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </td>
                  <td className="px-md py-sm text-center">
                    <div className="flex justify-center gap-xs">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded transition-all">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(p.id, p.nombre)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-all">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {proveedores.length === 0 && (
                <tr><td colSpan={7} className="text-center py-xl text-on-surface-variant">No hay proveedores registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — móvil */}
      <div className="md:hidden space-y-3">
        {proveedores.map((p) => (
          <div key={p.id} style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p className="font-body-md font-semibold text-on-surface">{p.nombre}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.ruc || "Sin RUC"}</p>
              </div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.activo !== false ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-error-container text-on-error-container border-error/20"}`}>
                {p.activo !== false ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
              <div><span className="text-gray-400">Contacto:</span> {p.contacto || "-"}</div>
              <div><span className="text-gray-400">Tel:</span> {p.telefono || "-"}</div>
              <div className="col-span-2"><span className="text-gray-400">Email:</span> {p.email || "-"}</div>
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-xs text-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Editar
              </button>
              <button onClick={() => handleDelete(p.id, p.nombre)} className="flex items-center gap-1 text-xs text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {proveedores.length === 0 && (
          <p className="text-center py-xl text-gray-500 text-sm">No hay proveedores registrados.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Proveedor" : "Agregar Proveedor"} size="lg">
        <form
          action={async (fd) => {
            if (editing) await actualizarProveedor(editing.id, fd)
            else await crearProveedor(fd)
          }}
          className="space-y-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Nombre</label>
              <input name="nombre" defaultValue={editing?.nombre} required className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">RUC</label>
              <input name="ruc" defaultValue={editing?.ruc} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Contacto</label>
              <input name="contacto" defaultValue={editing?.contacto} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Teléfono</label>
              <input name="telefono" defaultValue={editing?.telefono} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Email</label>
              <input name="email" type="email" defaultValue={editing?.email} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Dirección</label>
              <input name="direccion" defaultValue={editing?.direccion} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Notas</label>
              <textarea name="notas" defaultValue={editing?.notas} rows={3} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-md pt-md border-t border-outline-variant">
            <button type="button" onClick={() => setModalOpen(false)} className="px-lg py-sm rounded-lg border border-outline-variant font-body-md text-on-surface hover:bg-surface-container-low">Cancelar</button>
            <button type="submit" className="px-lg py-sm rounded-lg bg-secondary text-on-secondary font-bold hover:brightness-110 transition-all">{editing ? "Guardar" : "Crear"}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

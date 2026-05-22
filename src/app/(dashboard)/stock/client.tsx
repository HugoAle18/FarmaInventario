"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import toast, { Toaster } from "react-hot-toast"

const tipoColors: Record<string, string> = {
  entrada: "bg-secondary/10 text-secondary",
  salida: "bg-error-container text-on-error-container",
  ajuste: "bg-tertiary-fixed-dim/20 text-on-tertiary-container",
}

export default function StockClient({
  movimientos,
  productos,
}: {
  movimientos: any[]
  productos: { id: string; nombre: string }[]
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tipo, setTipo] = useState("entrada")
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const supabase = createClient()

  function openDrawer(t: string) {
    setTipo(t)
    setDrawerOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const producto_id = form.get("producto_id") as string
    const cantidad = parseInt(form.get("cantidad") as string)
    const motivo = form.get("motivo") as string

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No autenticado")

      const { error } = await supabase.from("movimientos_stock").insert({
        producto_id,
        tipo,
        cantidad,
        motivo,
        usuario_id: user.id,
      })

      if (error) throw error

      toast.success("Movimiento registrado correctamente")
      formRef.current?.reset()
      setDrawerOpen(false)
    } catch (err: any) {
      toast.error("Error: " + (err.message || JSON.stringify(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div className="space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary">Movimientos de Stock</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Historial de entradas, salidas y ajustes de inventario.
          </p>
        </div>
        <div className="flex gap-xs">
          {(["entrada", "salida", "ajuste"] as const).map((t) => (
            <button
              key={t}
              onClick={() => openDrawer(t)}
              className="bg-secondary text-on-secondary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">
                {t === "entrada" ? "add_box" : t === "salida" ? "remove_shopping_cart" : "edit_note"}
              </span>
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Fecha</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Tipo</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Producto</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Cantidad</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Stock Resultante</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Motivo</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {movimientos.map((m) => (
                <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant mono-font">
                    {new Date(m.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-md py-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${tipoColors[m.tipo] ?? ""}`}>{m.tipo}</span>
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md font-semibold text-on-surface">{m.productos?.nombre ?? "-"}</td>
                  <td className="px-md py-sm font-body-md text-body-md font-bold text-on-surface">{m.cantidad}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{m.stock_resultante}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{m.motivo ?? "-"}</td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{m.usuarios_farmacia?.nombre ?? "-"}</td>
                </tr>
              ))}
              {movimientos.length === 0 && (
                <tr><td colSpan={7} className="text-center py-xl text-on-surface-variant font-body-md">No hay movimientos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer lateral */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 40
            }}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '440px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#0F1B2D'
            }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                {tipo === 'entrada' ? '📦 Registrar Entrada' :
                 tipo === 'salida' ? '📤 Registrar Salida' :
                 '⚖️ Ajuste de Stock'}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '22px',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >✕</button>
            </div>

            <form id="stock-form" ref={formRef} onSubmit={handleSubmit} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '28px'
              }}>
                <input type="hidden" name="tipo" value={tipo} />

                <div>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Producto</label>
                  <select name="producto_id" required className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none">
                    <option value="">Seleccionar producto...</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Cantidad</label>
                  <input name="cantidad" type="number" min="1" required className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">Motivo</label>
                  <input
                    name="motivo"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
                    placeholder={tipo === "entrada" ? "Compra a proveedor" : tipo === "salida" ? "Venta al cliente" : "Ajuste manual"}
                  />
                </div>
              </div>
            </form>

            <div style={{
              padding: '20px 28px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >Cancelar</button>
              <button
                type="submit"
                form="stock-form"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  background: loading ? '#94A3B8' : '#10B981',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >{loading ? 'Registrando...' : 'Confirmar'}</button>
            </div>
          </div>
        </>
      )}

      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: "14px" } }} />
    </>
  )
}

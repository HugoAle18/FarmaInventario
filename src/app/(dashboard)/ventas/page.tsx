"use client"

import { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import toast, { Toaster } from "react-hot-toast"

const supabase = createClient()

export default function VentasPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [ventasHoy, setVentasHoy] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [carrito, setCarrito] = useState<{ producto: any; cantidad: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const [p, v] = await Promise.all([
          supabase.from("productos").select("id, nombre, codigo_sku, precio_venta, stock_actual").eq("activo", true).order("nombre"),
          supabase.from("ventas").select("*, detalle_ventas(*)").gte("created_at", hoy.toISOString()).order("created_at", { ascending: false }),
        ])
        setProductos(p.data ?? [])
        setVentasHoy(v.data ?? [])
      } catch (e) {
        console.error("Error loading data:", e)
      }
    }
    load()
  }, [])

  const resultados = useMemo(() => {
    if (!search.trim()) return []
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo_sku.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8)
  }, [search, productos])

  function agregar(p: any) {
    setCarrito((prev) => {
      const exist = prev.find((c) => c.producto.id === p.id)
      if (exist) return prev.map((c) => (c.producto.id === p.id ? { ...c, cantidad: c.cantidad + 1 } : c))
      return [...prev, { producto: p, cantidad: 1 }]
    })
    setSearch("")
  }

  function cambiarCantidad(id: string, delta: number) {
    setCarrito((prev) =>
      prev
        .map((c) => (c.producto.id === id ? { ...c, cantidad: c.cantidad + delta } : c))
        .filter((c) => c.cantidad > 0)
    )
  }

  function quitar(id: string) {
    setCarrito((prev) => prev.filter((c) => c.producto.id !== id))
  }

  const totalCarrito = carrito.reduce((sum, c) => sum + c.cantidad * c.producto.precio_venta, 0)

  async function loadVentasHoy() {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const { data } = await supabase
      .from("ventas")
      .select("*, detalle_ventas(*)")
      .gte("created_at", hoy.toISOString())
      .order("created_at", { ascending: false })
    setVentasHoy(data ?? [])
  }

  const handleRegistrar = async () => {
    if (carrito.length === 0) return
    setLoading(true)

    try {
      const { data: venta, error: errorVenta } = await supabase
        .from("ventas")
        .insert({ total: totalCarrito })
        .select()
        .single()

      if (errorVenta) {
        console.error("Error creando venta:", errorVenta)
        toast.error("Error: " + errorVenta.message)
        return
      }

      const detalles = carrito.map((c) => ({
        venta_id: venta.id,
        producto_id: c.producto.id,
        cantidad: c.cantidad,
        precio_unitario: c.producto.precio_venta,
      }))

      const { error: errorDetalle } = await supabase
        .from("detalle_ventas")
        .insert(detalles)

      if (errorDetalle) {
        console.error("Error en detalle:", errorDetalle)
        toast.error("Error detalle: " + errorDetalle.message)
        return
      }

      toast.success("Venta registrada: S/ " + totalCarrito.toFixed(2))
      setCarrito([])
      await loadVentasHoy()

    } catch (err: any) {
      console.error("Error inesperado:", err)
      toast.error("Error: " + (err.message || JSON.stringify(err)))
    } finally {
      setLoading(false)
    }
  }

  const totalHoy = ventasHoy.reduce((sum, v) => sum + Number(v.total), 0)

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: "14px" } }} />
      <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 120px)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 className="font-headline-sm text-headline-sm text-primary">Nueva Venta</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 font-body-md focus:ring-2 focus:ring-secondary/20 outline-none" />
          </div>

          {resultados.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
              {resultados.map((p) => (
                <button key={p.id} onClick={() => agregar(p)} disabled={p.stock_actual <= 0}
                  className="w-full flex items-center justify-between px-md py-sm hover:bg-surface-container-low transition-colors border-b border-outline-variant/30 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed text-left">
                  <div>
                    <p className="font-body-md font-semibold text-on-surface">{p.nombre}</p>
                    <p className="font-label-technical text-label-technical text-on-surface-variant">Stock: {p.stock_actual}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md font-bold text-secondary">S/ {Number(p.precio_venta).toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-md">Carrito ({carrito.length} items)</h3>
            {carrito.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant flex-1 flex items-center justify-center">Agrega productos desde la búsqueda</p>
            ) : (
              <div style={{ flex: 1, overflowY: "auto" }} className="space-y-xs">
                {carrito.map((c) => (
                  <div key={c.producto.id} className="flex items-center justify-between py-xs px-sm rounded-lg hover:bg-surface-container-low">
                    <div style={{ flex: 1 }}>
                      <p className="font-body-md font-semibold text-on-surface">{c.producto.nombre}</p>
                      <p className="font-label-technical text-label-technical text-on-surface-variant">S/ {Number(c.producto.precio_venta).toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-sm">
                      <button onClick={() => cambiarCantidad(c.producto.id, -1)} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">−</button>
                      <span className="font-body-md font-bold text-on-surface w-6 text-center">{c.cantidad}</span>
                      <button onClick={() => cambiarCantidad(c.producto.id, 1)} className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center hover:brightness-110 transition-all">+</button>
                      <button onClick={() => quitar(c.producto.id)} className="p-1 text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total</p>
              <p className="font-headline-md text-headline-md text-secondary font-bold">S/ {totalCarrito.toFixed(2)}</p>
            </div>
            <button onClick={handleRegistrar} disabled={carrito.length === 0 || loading}
              className="bg-secondary text-on-secondary px-xl py-sm rounded-lg font-bold text-[15px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Registrando..." : "Registrar Venta"}
            </button>
          </div>
        </div>

        <div style={{ width: "380px", display: "flex", flexDirection: "column", gap: "16px" }} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-primary">Ventas Hoy</h3>
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total</p>
              <p className="font-headline-sm text-headline-sm text-secondary font-bold">S/ {totalHoy.toFixed(2)}</p>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }} className="space-y-xs">
            {ventasHoy.map((v) => (
              <div key={v.id} className="p-sm rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-label-technical text-label-technical text-on-surface-variant">
                    {new Date(v.created_at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="font-body-md font-bold text-secondary">S/ {Number(v.total).toFixed(2)}</p>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-[12px] mt-xs">{v.detalle_ventas?.length ?? 0} productos</p>
              </div>
            ))}
            {ventasHoy.length === 0 && <p className="font-body-md text-body-md text-on-surface-variant text-center py-xl">No hay ventas hoy</p>}
          </div>
        </div>
      </div>
    </>
  )
}

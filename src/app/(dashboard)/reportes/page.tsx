"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

const supabase = createClient()

export default function ReportesPage() {
  const [ventasHoy, setVentasHoy] = useState(0)
  const [ventasMes, setVentasMes] = useState(0)
  const [stockBajo, setStockBajo] = useState(0)
  const [porVencer, setPorVencer] = useState(0)
  const [ventas7d, setVentas7d] = useState<any[]>([])
  const [topProductos, setTopProductos] = useState<any[]>([])
  const [alertasStock, setAlertasStock] = useState<any[]>([])
  const [alertasVencimiento, setAlertasVencimiento] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const hoy = new Date()
      const hoyStr = hoy.toISOString().split("T")[0]

      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0]

      // Ventas hoy
      const { data: vHoy } = await supabase
        .from("ventas")
        .select("total")
        .gte("created_at", hoyStr)
      setVentasHoy(vHoy?.reduce((s, v) => s + Number(v.total), 0) ?? 0)

      // Ventas del mes
      const { data: vMes } = await supabase
        .from("ventas")
        .select("total")
        .gte("created_at", inicioMes)
      setVentasMes(vMes?.reduce((s, v) => s + Number(v.total), 0) ?? 0)

      // Stock bajo
      const { data: prod } = await supabase
        .from("productos")
        .select("stock_actual, stock_minimo")
        .gt("stock_minimo", 0)
      setStockBajo(prod?.filter((p) => p.stock_actual <= p.stock_minimo).length ?? 0)

      // Productos por vencer (30 días)
      const dentro30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      const { count: pv } = await supabase
        .from("lotes")
        .select("*", { count: "exact", head: true })
        .lte("fecha_vencimiento", dentro30)
        .gte("fecha_vencimiento", hoyStr)
      setPorVencer(pv ?? 0)

      // Ventas últimos 7 días
      const hace7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data: v7 } = await supabase
        .from("ventas")
        .select("total, created_at")
        .gte("created_at", hace7)
        .order("created_at")

      const dias: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        dias[d.toLocaleDateString("es-PE", { weekday: "short" }).toUpperCase()] = 0
      }
      v7?.forEach((v) => {
        const dia = new Date(v.created_at).toLocaleDateString("es-PE", { weekday: "short" }).toUpperCase()
        dias[dia] = (dias[dia] || 0) + Number(v.total)
      })
      setVentas7d(Object.entries(dias).map(([dia, total]) => ({ dia, total })))

      // Top 5 productos más vendidos
      const { data: top } = await supabase
        .from("detalle_ventas")
        .select("producto_id, cantidad, productos(nombre)")
      const agrupado: Record<string, { nombre: string; total: number }> = {}
      top?.forEach((d: any) => {
        const id = d.producto_id
        if (!agrupado[id]) agrupado[id] = { nombre: d.productos?.nombre ?? "—", total: 0 }
        agrupado[id].total += d.cantidad
      })
      setTopProductos(
        Object.entries(agrupado)
          .map(([, v]) => v)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      )

      // Alertas stock bajo
      const { data: alertasStock } = await supabase
        .from("productos")
        .select("nombre, stock_actual, stock_minimo")
        .gt("stock_minimo", 0)
        .lte("stock_actual", 0)
      setAlertasStock(
        alertasStock?.map((p) => ({
          ...p,
          // Re-query to match stock_actual <= stock_minimo accurately
        })) ?? []
      )

      // Productos con stock bajo (actual)
      const { data: bajos } = await supabase
        .from("productos")
        .select("nombre, stock_actual, stock_minimo, codigo_sku")
        .gt("stock_minimo", 0)
      setAlertasStock(
        bajos?.filter((p) => p.stock_actual <= p.stock_minimo).slice(0, 5) ?? []
      )

      // Lotes por vencer
      const { data: lotes } = await supabase
        .from("lotes")
        .select("codigo_lote, fecha_vencimiento, productos(nombre)")
        .lte("fecha_vencimiento", dentro30)
        .gte("fecha_vencimiento", hoyStr)
        .limit(5)
      setAlertasVencimiento(lotes ?? [])

    } catch (e) {
      console.error("Error loading reportes:", e)
    }
  }

  const maxTop = Math.max(...topProductos.map((p) => p.total), 1)

  async function exportPDF() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("FarmaInventario - Reporte", 14, 22)
    doc.setFontSize(12)
    doc.text(`Generado: ${new Date().toLocaleDateString("es-PE")}`, 14, 32)

    doc.setFontSize(14)
    doc.text("KPIs", 14, 46)
    const kpiData = [
      ["Ventas Hoy", `S/ ${ventasHoy.toFixed(2)}`],
      ["Ventas del Mes", `S/ ${ventasMes.toFixed(2)}`],
      ["Stock Bajo", `${stockBajo}`],
      ["Por Vencer (30d)", `${porVencer}`],
    ]
    ;(doc as any).autoTable({ startY: 52, head: [["Indicador", "Valor"]], body: kpiData })

    const finalY = (doc as any).lastAutoTable.finalY + 10 || 100

    const ventasBody = ventas7d.map((v) => [v.dia, `S/ ${v.total.toFixed(2)}`])
    ;(doc as any).autoTable({
      startY: finalY,
      head: [["Día", "Total"]],
      body: ventasBody,
      title: "Ventas Últimos 7 Días",
    })

    doc.save(`reporte-farmainventario-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(
      ventas7d.map((v) => ({ Día: v.dia, "Total (S/)": v.total }))
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Ventas7d")
    XLSX.writeFile(wb, `reporte-ventas-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Reportes</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Estadísticas y resúmenes de inventario y ventas.
          </p>
        </div>
        <div className="flex gap-md">
          <button onClick={exportPDF} className="bg-primary-container text-on-primary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Exportar PDF
          </button>
          <button onClick={exportExcel} className="bg-secondary text-on-secondary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined">table_chart</span>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
          <p className="font-label-caps text-label-caps text-on-surface-variant">Ventas Hoy</p>
          <p className="font-headline-lg text-headline-lg text-secondary font-bold mt-xs">S/ {ventasHoy.toFixed(2)}</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
          <p className="font-label-caps text-label-caps text-on-surface-variant">Ventas del Mes</p>
          <p className="font-headline-lg text-headline-lg text-secondary font-bold mt-xs">S/ {ventasMes.toFixed(2)}</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
          <p className="font-label-caps text-label-caps text-on-surface-variant">Stock Bajo</p>
          <p className="font-headline-lg text-headline-lg text-amber-600 font-bold mt-xs">{stockBajo}</p>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
          <p className="font-label-caps text-label-caps text-on-surface-variant">Por Vencer (30d)</p>
          <p className="font-headline-lg text-headline-lg text-error font-bold mt-xs">{porVencer}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Ventas Últimos 7 Días</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventas7d} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="dia" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                formatter={(value: any) => [`S/ ${Number(value).toFixed(2)}`, "Total"]}
              />
              <Area type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Top 5 productos */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Top 5 Productos Más Vendidos</h3>
          {topProductos.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Sin datos de ventas aún.</p>
          ) : (
            <div className="space-y-md">
              {topProductos.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-xs">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">{p.nombre}</span>
                    <span className="font-label-technical text-label-technical text-secondary font-bold">{p.total} vendidos</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-secondary transition-all"
                      style={{ width: `${(p.total / maxTop) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas críticas */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Alertas Críticas</h3>
          {alertasStock.length === 0 && alertasVencimiento.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Todo en orden ✅</p>
          ) : (
            <div className="space-y-md">
              {alertasStock.map((p, i) => (
                <div key={`stock-${i}`} className="flex items-center gap-md p-sm rounded-lg bg-amber-50 border border-amber-200">
                  <span className="material-symbols-outlined text-amber-600">inventory</span>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md font-semibold text-amber-900">{p.nombre}</p>
                    <p className="text-[12px] text-amber-700">Stock: {p.stock_actual} / Mínimo: {p.stock_minimo}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-200 text-amber-800 uppercase">Stock Bajo</span>
                </div>
              ))}
              {alertasVencimiento.map((l, i) => (
                <div key={`venc-${i}`} className="flex items-center gap-md p-sm rounded-lg bg-red-50 border border-red-200">
                  <span className="material-symbols-outlined text-error">event_busy</span>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md font-semibold text-red-900">{l.productos?.nombre}</p>
                    <p className="text-[12px] text-red-700">Lote {l.codigo_lote} — Vence: {l.fecha_vencimiento}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-200 text-red-800 uppercase">Vence Pronto</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

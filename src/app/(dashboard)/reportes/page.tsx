"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

const supabase = createClient()

export default function ReportesPage() {
  const [ventasHoy, setVentasHoy] = useState(0)
  const [ventasMes, setVentasMes] = useState(0)
  const [stockBajo, setStockBajo] = useState(0)
  const [ventasGrafico, setVentasGrafico] = useState<any[]>([])
  const [topProductos, setTopProductos] = useState<any[]>([])
  const [alertasStock, setAlertasStock] = useState<any[]>([])
  const [stockCritico, setStockCritico] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const hoy = new Date()
      const hoyStr = hoy.toISOString().split("T")[0]
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split("T")[0]
      const hace7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Ventas hoy
      const { data: vHoy } = await supabase.from("ventas").select("total").gte("created_at", hoyStr)
      setVentasHoy(vHoy?.reduce((s, v) => s + Number(v.total), 0) ?? 0)

      // Ventas del mes
      const { data: vMes } = await supabase.from("ventas").select("total").gte("created_at", inicioMes)
      setVentasMes(vMes?.reduce((s, v) => s + Number(v.total), 0) ?? 0)

      // Stock bajo count
      const { data: prod } = await supabase.from("productos").select("stock_actual, stock_minimo").gt("stock_minimo", 0)
      setStockBajo(prod?.filter((p) => p.stock_actual <= p.stock_minimo).length ?? 0)

      // Ventas últimos 7 días para gráfico
      const { data: v7 } = await supabase.from("ventas").select("total, created_at").gte("created_at", hace7).order("created_at")
      const dias: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const label = d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })
        dias[label] = 0
      }
      v7?.forEach((v) => {
        const label = new Date(v.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" })
        dias[label] = (dias[label] || 0) + Number(v.total)
      })
      setVentasGrafico(Object.entries(dias).map(([fecha, total]) => ({ fecha, total })))

      // Top 5 productos
      const { data: top } = await supabase.from("detalle_ventas").select("producto_id, cantidad, productos(nombre)")
      const agrupado: Record<string, { nombre: string; total: number }> = {}
      top?.forEach((d: any) => {
        const id = d.producto_id
        if (!agrupado[id]) agrupado[id] = { nombre: d.productos?.nombre ?? "—", total: 0 }
        agrupado[id].total += d.cantidad
      })
      setTopProductos(Object.entries(agrupado).map(([, v]) => v).sort((a, b) => b.total - a.total).slice(0, 5))

      // Alertas stock via RPC
      const { data: stockBajoData } = await supabase.rpc("get_productos_stock_bajo")
      setAlertasStock(stockBajoData ?? [])
      setStockCritico(stockBajoData?.filter((p: any) => p.stock_actual <= 5).length ?? 0)

    } catch (e) {
      console.error("Error loading reportes:", e)
    }
  }

  const maxTop = Math.max(...topProductos.map((p) => p.total), 1)

  const exportarPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setTextColor(15, 27, 45)
    doc.text("FarmaInventario - Reporte de Ventas", 14, 22)

    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generado: ${new Date().toLocaleDateString("es-PE")}`, 14, 32)

    doc.setFontSize(13)
    doc.setTextColor(15, 27, 45)
    doc.text("Resumen", 14, 45)

    autoTable(doc, {
      startY: 50,
      head: [["Métrica", "Valor"]],
      body: [
        ["Ventas hoy", `S/ ${ventasHoy}`],
        ["Ventas del mes", `S/ ${ventasMes}`],
        ["Productos stock bajo", `${stockBajo} productos`],
        ["Stock Crítico", `${stockCritico} productos`],
      ],
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
    })

    doc.text("Ventas del mes", 14, (doc as any).lastAutoTable.finalY + 15)

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Fecha", "Total"]],
      body: ventasGrafico.map((v) => [v.fecha, `S/ ${v.total}`]),
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
    })

    doc.save(`reporte-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(ventasGrafico.map((v) => ({ Fecha: v.fecha, "Total (S/)": v.total })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Ventas")
    XLSX.writeFile(wb, `reporte-ventas-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between flex-wrap gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Reportes</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Estadísticas y resúmenes de inventario y ventas.</p>
        </div>
        <div className="flex gap-md">
          <button onClick={exportarPDF} className="bg-primary-container text-on-primary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined">picture_as_pdf</span> Exportar PDF
          </button>
          <button onClick={exportExcel} className="bg-secondary text-on-secondary px-lg py-sm rounded-lg flex items-center gap-sm font-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined">table_chart</span> Exportar Excel
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
          <p className="font-label-caps text-label-caps text-on-surface-variant">Stock Crítico (≤5)</p>
          <p className="font-headline-lg text-headline-lg text-error font-bold mt-xs">{stockCritico}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Ventas Últimos 7 Días</h3>
        <div style={{ width: '100%', overflowX: 'hidden' }}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ventasGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="fecha" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                formatter={(value: any) => [`S/ ${Number(value).toFixed(2)}`, "Total"]} />
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
                    <span className="font-body-md font-semibold text-on-surface">{p.nombre}</span>
                    <span className="font-label-technical text-label-technical text-secondary font-bold">{p.total} vendidos</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${(p.total / maxTop) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas desde RPC */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-lg">Alertas Críticas</h3>
          {alertasStock.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Todo en orden ✅</p>
          ) : (
            <div className="space-y-md">
              {alertasStock.map((p: any, i: number) => {
                const esAgotado = p.stock_actual === 0
                const esCritico = p.stock_actual <= 5
                const badge = esAgotado
                  ? { label: "Agotado", bg: "bg-red-50", border: "border-red-200", icon: "priority_high", iconColor: "text-error", textColor: "text-red-900", subText: "text-red-700", badgeBg: "bg-red-200", badgeText: "text-red-800" }
                  : esCritico
                    ? { label: "Stock Crítico", bg: "bg-red-50", border: "border-red-200", icon: "priority_high", iconColor: "text-error", textColor: "text-red-900", subText: "text-red-700", badgeBg: "bg-red-200", badgeText: "text-red-800" }
                    : { label: "Stock Bajo", bg: "bg-amber-50", border: "border-amber-200", icon: "inventory", iconColor: "text-amber-600", textColor: "text-amber-900", subText: "text-amber-700", badgeBg: "bg-amber-200", badgeText: "text-amber-800" }
                return (
                  <div key={`alert-${i}`} className={`flex items-center gap-md p-sm rounded-lg ${badge.bg} ${badge.border}`}>
                    <span className={`material-symbols-outlined ${badge.iconColor}`}>{badge.icon}</span>
                    <div className="flex-1">
                      <p className={`font-body-md font-semibold ${badge.textColor}`}>{p.nombre}</p>
                      <p className={`text-[12px] ${badge.subText}`}>Stock: {p.stock_actual} / Mínimo: {p.stock_minimo}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${badge.badgeBg} ${badge.badgeText} uppercase`}>{badge.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

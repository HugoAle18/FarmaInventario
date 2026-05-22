import { createClient } from "@/lib/supabase/server"
import VentasClient from "./client"

export default async function VentasPage() {
  const supabase = await createClient()
  let productos: any[] = []
  let ventasHoy: any[] = []

  try {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const [p, v] = await Promise.all([
      supabase.from("productos").select("id, nombre, codigo_sku, precio_venta, stock_actual").eq("activo", true).order("nombre"),
      supabase.from("ventas").select("*, detalle_ventas(*)").gte("created_at", hoy.toISOString()).order("created_at", { ascending: false }),
    ])
    productos = p.data ?? []
    ventasHoy = v.data ?? []
  } catch {}

  return <VentasClient productos={productos} ventasHoy={ventasHoy} />
}

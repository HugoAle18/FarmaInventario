import { createClient } from "@/lib/supabase/server"
import { getMovimientosStock } from "@/lib/supabase/queries"
import StockClient from "./client"

export default async function StockPage() {
  let movimientos: any[] = []
  let productos: any[] = []

  try {
    const supabase = await createClient()
    const [m, p] = await Promise.all([
      getMovimientosStock(),
      supabase.from("productos").select("id, nombre").eq("activo", true).order("nombre"),
    ])
    movimientos = m
    productos = p.data ?? []
  } catch {}

  return <StockClient movimientos={movimientos} productos={productos} />
}

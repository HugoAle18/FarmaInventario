import { createClient } from "@/lib/supabase/server"
import StockClient from "./client"

export default async function StockPage() {
  let productos: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase.from("productos").select("id, nombre").eq("activo", true).order("nombre")
    productos = data ?? []
  } catch {}

  return <StockClient productos={productos} />
}

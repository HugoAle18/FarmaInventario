import { createClient } from "@/lib/supabase/server"
import ProveedoresClient from "./client"

export default async function ProveedoresPage() {
  const supabase = await createClient()
  let proveedores: any[] = []

  try {
    const { data } = await supabase.from("proveedores").select("*").order("nombre")
    proveedores = data ?? []
  } catch {}

  return <ProveedoresClient proveedores={proveedores} />
}

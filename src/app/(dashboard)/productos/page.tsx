import { createClient } from "@/lib/supabase/server"
import { getProductos } from "@/lib/supabase/queries"
import ProductosClient from "./client"

export default async function ProductosPage() {
  let productos: any[] = []
  let categorias: { id: string; nombre: string }[] = []

  try {
    const supabase = await createClient()
    const [p, c] = await Promise.all([
      getProductos(),
      supabase.from("categorias").select("id, nombre").order("nombre"),
    ])
    productos = p
    categorias = c.data ?? []
  } catch {
    // Sin conexión a Supabase
  }

  return <ProductosClient initialProductos={productos} categorias={categorias} />
}

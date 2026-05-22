import { createClient } from "./server"

export async function getDashboardStats() {
  const supabase = await createClient()

  const { count: totalProductos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  const { data: productos } = await supabase
    .from("productos")
    .select("stock_actual, stock_minimo")
    .gt("stock_minimo", 0)

  const stockBajo =
    productos?.filter((p) => p.stock_actual <= p.stock_minimo).length ?? 0

  const treintaDias = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]

  const { count: porVencer } = await supabase
    .from("lotes")
    .select("*", { count: "exact", head: true })
    .lte("fecha_vencimiento", treintaDias)
    .gte("fecha_vencimiento", new Date().toISOString().split("T")[0])

  const hoy = new Date().toISOString().split("T")[0]
  const { data: ventasHoy } = await supabase
    .from("ventas")
    .select("total")
    .gte("fecha_venta", hoy)

  const totalVentasHoy =
    ventasHoy?.reduce((sum, v) => sum + Number(v.total), 0) ?? 0

  return {
    totalProductos: totalProductos ?? 0,
    stockBajo,
    porVencer: porVencer ?? 0,
    ventasHoy: totalVentasHoy,
  }
}

export async function getProductos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("productos")
    .select(`*, categorias(nombre)`)
    .eq("activo", true)
    .order("nombre")

  if (error) throw error
  return data ?? []
}

export async function getAlertasCriticas() {
  const supabase = await createClient()

  const { data: alertas } = await supabase
    .from("alertas")
    .select(`*, productos(nombre, codigo_sku)`)
    .eq("leida", false)
    .order("created_at", { ascending: false })
    .limit(5)

  return alertas ?? []
}

export async function getMovimientosStock() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("movimientos_stock")
    .select(`
      *,
      productos(nombre, codigo_sku),
      usuarios_farmacia(nombre)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function getProveedores() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("proveedores")
    .select("*")
    .order("nombre")

  if (error) throw error
  return data ?? []
}

export async function getVentas() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ventas")
    .select(`
      *,
      usuarios_farmacia(nombre),
      detalle_ventas(*)
    `)
    .order("fecha_venta", { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

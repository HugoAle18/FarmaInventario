"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function registrarVenta(detalle: { producto_id: string; cantidad: number; precio_unitario: number }[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const total = detalle.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0)

  const { data: venta, error: errVenta } = await supabase
    .from("ventas")
    .insert({ total, usuario_id: user.id })
    .select()
    .single()

  if (errVenta) throw new Error(errVenta.message)

  const detalleInsert = detalle.map((d) => ({
    venta_id: venta.id,
    producto_id: d.producto_id,
    cantidad: d.cantidad,
    precio_unitario: d.precio_unitario,
    subtotal: d.cantidad * d.precio_unitario,
  }))

  const { error: errDetalle } = await supabase.from("detalle_ventas").insert(detalleInsert)
  if (errDetalle) throw new Error(errDetalle.message)

  revalidatePath("/ventas")
  return venta
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function crearProducto(formData: FormData) {
  const supabase = await createClient()

  const data = {
    codigo_sku: formData.get("codigo_sku") as string,
    nombre: formData.get("nombre") as string,
    categoria_id: formData.get("categoria_id") as string,
    precio_venta: parseFloat(formData.get("precio_venta") as string),
    precio_costo: parseFloat(formData.get("precio_costo") as string),
    stock_actual: parseInt(formData.get("stock_actual") as string) || 0,
    stock_minimo: parseInt(formData.get("stock_minimo") as string) || 0,
    laboratorio: formData.get("laboratorio") as string,
    unidad_medida: formData.get("unidad_medida") as string || "unidad",
    descripcion: formData.get("descripcion") as string,
  }

  const { error } = await supabase.from("productos").insert(data)

  if (error) throw new Error(error.message)

  revalidatePath("/productos")
  redirect("/productos")
}

export async function actualizarProducto(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    codigo_sku: formData.get("codigo_sku") as string,
    nombre: formData.get("nombre") as string,
    categoria_id: formData.get("categoria_id") as string,
    precio_venta: parseFloat(formData.get("precio_venta") as string),
    precio_costo: parseFloat(formData.get("precio_costo") as string),
    stock_actual: parseInt(formData.get("stock_actual") as string) || 0,
    stock_minimo: parseInt(formData.get("stock_minimo") as string) || 0,
    laboratorio: formData.get("laboratorio") as string,
    unidad_medida: formData.get("unidad_medida") as string || "unidad",
    descripcion: formData.get("descripcion") as string,
  }

  const { error } = await supabase
    .from("productos")
    .update(data)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/productos")
  redirect("/productos")
}

export async function eliminarProducto(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("productos").update({ activo: false }).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/productos")
}

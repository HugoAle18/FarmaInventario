"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function registrarMovimiento(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const tipo = formData.get("tipo") as string
  const producto_id = formData.get("producto_id") as string
  const cantidad = parseInt(formData.get("cantidad") as string)

  if (!producto_id || !cantidad || cantidad <= 0) {
    throw new Error("Datos inválidos")
  }

  const { error } = await supabase.from("movimientos_stock").insert({
    producto_id,
    tipo,
    cantidad,
    motivo: formData.get("motivo") as string,
    usuario_id: user.id,
    lote_id: formData.get("lote_id") || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/stock")
  redirect("/stock")
}

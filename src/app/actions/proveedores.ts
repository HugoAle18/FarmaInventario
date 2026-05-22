"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function crearProveedor(formData: FormData) {
  const supabase = await createClient()

  const data = {
    nombre: formData.get("nombre") as string,
    ruc: formData.get("ruc") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
    direccion: formData.get("direccion") as string,
    notas: formData.get("notas") as string,
  }

  const { error } = await supabase.from("proveedores").insert(data)
  if (error) throw new Error(error.message)

  revalidatePath("/proveedores")
  redirect("/proveedores")
}

export async function actualizarProveedor(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    nombre: formData.get("nombre") as string,
    ruc: formData.get("ruc") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
    direccion: formData.get("direccion") as string,
    notas: formData.get("notas") as string,
    activo: formData.get("activo") === "true",
  }

  const { error } = await supabase.from("proveedores").update(data).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/proveedores")
  redirect("/proveedores")
}

export async function eliminarProveedor(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("proveedores").update({ activo: false }).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/proveedores")
}

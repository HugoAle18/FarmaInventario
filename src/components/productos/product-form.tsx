"use client"

import { useActionState } from "react"

export default function ProductForm({
  product,
  categorias,
  onSubmit,
  onCancel,
}: {
  product?: any
  categorias: { id: string; nombre: string }[]
  onSubmit: (formData: FormData) => void
  onCancel: () => void
}) {
  const isEditing = !!product

  return (
    <form action={onSubmit} className="space-y-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="md:col-span-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Nombre del medicamento
          </label>
          <input
            name="nombre"
            defaultValue={product?.nombre}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Código SKU
          </label>
          <input
            name="codigo_sku"
            defaultValue={product?.codigo_sku}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Categoría
          </label>
          <select
            name="categoria_id"
            defaultValue={product?.categoria_id}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          >
            <option value="">Seleccionar...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Precio de venta (S/)
          </label>
          <input
            name="precio_venta"
            type="number"
            step="0.01"
            defaultValue={product?.precio_venta}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Precio de costo (S/)
          </label>
          <input
            name="precio_costo"
            type="number"
            step="0.01"
            defaultValue={product?.precio_costo}
            required
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Stock actual
          </label>
          <input
            name="stock_actual"
            type="number"
            defaultValue={product?.stock_actual ?? 0}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Stock mínimo
          </label>
          <input
            name="stock_minimo"
            type="number"
            defaultValue={product?.stock_minimo ?? 0}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Laboratorio
          </label>
          <input
            name="laboratorio"
            defaultValue={product?.laboratorio}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          />
        </div>

        <div>
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Unidad de medida
          </label>
          <select
            name="unidad_medida"
            defaultValue={product?.unidad_medida ?? "unidad"}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
          >
            <option value="unidad">Unidad</option>
            <option value="tableta">Tableta</option>
            <option value="cápsula">Cápsula</option>
            <option value="ml">Mililitro</option>
            <option value="mg">Miligramo</option>
            <option value="efervescente">Efervescente</option>
            <option value="pluma">Pluma</option>
            <option value="frasco">Frasco</option>
            <option value="ampolla">Ampolla</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs">
            Descripción
          </label>
          <textarea
            name="descripcion"
            defaultValue={product?.descripcion}
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-md pt-md border-t border-outline-variant">
        <button
          type="button"
          onClick={onCancel}
          className="px-lg py-sm rounded-lg border border-outline-variant font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-lg py-sm rounded-lg bg-secondary text-on-secondary font-bold hover:brightness-110 active:scale-95 transition-all"
        >
          {isEditing ? "Guardar Cambios" : "Agregar Producto"}
        </button>
      </div>
    </form>
  )
}

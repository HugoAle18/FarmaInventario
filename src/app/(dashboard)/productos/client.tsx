"use client"

import { useState, useMemo, useCallback } from "react"
import SearchInput from "@/components/ui/search-input"
import Pagination from "@/components/ui/pagination"
import Badge from "@/components/ui/badge"
import Modal from "@/components/ui/modal"
import ProductForm from "@/components/productos/product-form"
import { crearProducto, eliminarProducto } from "@/app/actions/productos"
import type { StatusStock } from "@/types"

function getStatus(stock: number, minimo: number): StatusStock {
  if (stock <= 0) return "agotado"
  if (stock <= minimo) return "stock_bajo"
  return "disponible"
}

export default function ProductosClient({
  initialProductos,
  categorias,
}: {
  initialProductos: any[]
  categorias: { id: string; nombre: string }[]
}) {
  const [search, setSearch] = useState("")
  const [categoria, setCategoria] = useState("")
  const [laboratorio, setLaboratorio] = useState("")
  const [estado, setEstado] = useState("")
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const pageSize = 5

  const filtered = useMemo(() => {
    return initialProductos.filter((p) => {
      if (
        search &&
        !p.nombre.toLowerCase().includes(search.toLowerCase()) &&
        !p.codigo_sku.toLowerCase().includes(search.toLowerCase())
      )
        return false
      if (categoria && p.categorias?.nombre?.toLowerCase() !== categoria) return false
      if (laboratorio && p.laboratorio?.toLowerCase() !== laboratorio) return false
      if (estado) {
        const s = getStatus(p.stock_actual, p.stock_minimo)
        if (s !== estado) return false
      }
      return true
    })
  }, [initialProductos, search, categoria, laboratorio, estado])

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const stats = useMemo(() => {
    const total = initialProductos.length
    const stockBajo = initialProductos.filter(
      (p) => p.stock_actual <= p.stock_minimo && p.stock_minimo > 0
    ).length
    const agotados = initialProductos.filter((p) => p.stock_actual <= 0).length
    return { total, porVencer: 0, stockBajo, agotados }
  }, [initialProductos])

  const handleDelete = useCallback(async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    try {
      await eliminarProducto(id)
    } catch (e) {
      alert("Error al eliminar el producto")
    }
  }, [])

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div className="space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Inventario de Productos
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Gestión centralizada de existencias, lotes y fechas de caducidad.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="flex-1 min-w-[120px] bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none">
            <option value="">Categoría</option>
            <option value="analgesicos">Analgésicos</option>
            <option value="antibioticos">Antibióticos</option>
            <option value="vitaminas">Vitaminas</option>
          </select>
          <select value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} className="flex-1 min-w-[120px] bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none">
            <option value="">Laboratorio</option>
            <option value="pfizer">Pfizer</option>
            <option value="bayer">Bayer</option>
            <option value="roche">Roche</option>
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="flex-1 min-w-[120px] bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none">
            <option value="">Estado</option>
            <option value="disponible">Disponible</option>
            <option value="stock_bajo">Stock Bajo</option>
            <option value="agotado">Agotado</option>
          </select>
          <button onClick={() => setModalOpen(true)} className="w-full sm:w-auto bg-secondary text-on-secondary px-lg py-2 rounded-lg flex items-center justify-center gap-sm font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-lg">
        <SearchInput
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Código</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Nombre</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Categoría</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Stock</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Mínimo</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Precio</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Estado</th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {paginated.map((p) => {
                const status = getStatus(p.stock_actual, p.stock_minimo)
                return (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors cursor-default">
                    <td className="px-md py-sm font-label-technical text-label-technical text-on-surface-variant mono-font">{p.codigo_sku}</td>
                    <td className="px-md py-sm font-body-md text-body-md font-semibold text-on-surface">{p.nombre}</td>
                    <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{p.categorias?.nombre ?? "-"}</td>
                    <td className={`px-md py-sm font-body-md text-body-md font-bold ${status === "agotado" ? "text-error" : status === "stock_bajo" ? "text-tertiary-fixed-dim" : "text-secondary"}`}>{p.stock_actual.toLocaleString()}</td>
                    <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">{p.stock_minimo}</td>
                    <td className="px-md py-sm font-body-md text-body-md font-medium text-on-surface">${Number(p.precio_venta).toFixed(2)}</td>
                    <td className="px-md py-sm"><Badge status={status} /></td>
                    <td className="px-md py-sm text-center">
                      <div className="flex justify-center gap-xs">
                        <button onClick={() => handleDelete(p.id, p.nombre)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-all">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — móvil */}
      <div className="md:hidden space-y-3">
        {paginated.map((p) => {
          const status = getStatus(p.stock_actual, p.stock_minimo)
          const statusColors: Record<string, { bg: string; text: string; label: string }> = {
            disponible: { bg: "bg-green-100", text: "text-green-800", label: "Disponible" },
            stock_bajo: { bg: "bg-amber-100", text: "text-amber-800", label: "Stock Bajo" },
            agotado: { bg: "bg-red-100", text: "text-red-800", label: "Agotado" },
          }
          const sc = statusColors[status] ?? { bg: "bg-gray-100", text: "text-gray-800", label: status }
          return (
            <div key={p.id} style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p className="font-body-md font-semibold text-on-surface">{p.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.codigo_sku}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${sc.bg} ${sc.text}`}>{sc.label}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>Stock: <strong>{p.stock_actual}</strong></span>
                <span>Mín: {p.stock_minimo}</span>
                <span>Cat: {p.categorias?.nombre ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-secondary">${Number(p.precio_venta).toFixed(2)}</span>
                <button onClick={() => handleDelete(p.id, p.nombre)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}
        {paginated.length === 0 && (
          <p className="text-center py-xl text-gray-500 text-sm">No se encontraron productos.</p>
        )}
      </div>

      {/* Pagination + Stats */}
      <div className="space-y-lg">
        <Pagination
          currentPage={page}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="bg-surface border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">TOTAL SKUS</p>
              <p className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">POR VENCER</p>
              <p className="text-2xl font-bold text-primary">{stats.porVencer}</p>
            </div>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-tertiary-fixed-dim/20 flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined text-3xl">low_priority</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">STOCK BAJO</p>
              <p className="text-2xl font-bold text-primary">{stats.stockBajo}</p>
            </div>
          </div>
          <div className="bg-surface border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">AGOTADOS</p>
              <p className="text-2xl font-bold text-primary">{stats.agotados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar Producto" size="lg">
        <ProductForm
          categorias={categorias}
          onSubmit={crearProducto}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </>
  )
}

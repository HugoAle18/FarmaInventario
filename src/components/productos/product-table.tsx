"use client"

import Badge from "@/components/ui/badge"
import type { StatusStock } from "@/types"

const productosMock = [
  {
    codigo: "P-2024-001",
    nombre: "Amoxicilina 500mg",
    categoria: "Antibiótico",
    stock: 450,
    minimo: 50,
    lote: "L993822",
    vencimiento: "12/2026",
    precio: "$12.50",
    estado: "disponible" as StatusStock,
  },
  {
    codigo: "P-2024-042",
    nombre: "Paracetamol Jarabe",
    categoria: "Analgésico",
    stock: 12,
    minimo: 20,
    lote: "L882104",
    vencimiento: "08/2025",
    precio: "$8.75",
    estado: "stock_bajo" as StatusStock,
  },
  {
    codigo: "P-2024-115",
    nombre: "Insulina Lantus",
    categoria: "Endocrino",
    stock: 0,
    minimo: 5,
    lote: "N/A",
    vencimiento: "-",
    precio: "$85.00",
    estado: "agotado" as StatusStock,
  },
  {
    codigo: "P-2024-088",
    nombre: "Vitamina C Eferv.",
    categoria: "Vitaminas",
    stock: 120,
    minimo: 30,
    lote: "L771221",
    vencimiento: "05/2024",
    precio: "$5.25",
    estado: "vence_pronto" as StatusStock,
  },
  {
    codigo: "P-2024-009",
    nombre: "Ibuprofeno 400mg",
    categoria: "Analgésico",
    stock: 1200,
    minimo: 100,
    lote: "L990012",
    vencimiento: "10/2027",
    precio: "$4.10",
    estado: "disponible" as StatusStock,
  },
]

export default function ProductTable({ searchTerm }: { searchTerm: string }) {
  const filtered = productosMock.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant">
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Código
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Nombre del Medicamento
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Stock
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Mínimo
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Lote
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Precio
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Estado
              </th>
              <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {filtered.map((p) => (
              <tr key={p.codigo} className="hover:bg-surface-container-low transition-colors cursor-default">
                <td className="px-md py-sm font-label-technical text-label-technical text-on-surface-variant mono-font">
                  {p.codigo}
                </td>
                <td className="px-md py-sm font-body-md text-body-md font-semibold text-on-surface">
                  {p.nombre}
                </td>
                <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                  {p.categoria}
                </td>
                <td
                  className={`px-md py-sm font-body-md text-body-md font-bold ${
                    p.estado === "agotado"
                      ? "text-error"
                      : p.estado === "stock_bajo"
                        ? "text-tertiary-fixed-dim"
                        : "text-secondary"
                  }`}
                >
                  {p.stock.toLocaleString()}
                </td>
                <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                  {p.minimo}
                </td>
                <td className="px-md py-sm font-label-technical text-label-technical mono-font">
                  {p.lote}
                </td>
                <td
                  className={`px-md py-sm font-body-md text-body-md ${
                    p.estado === "vence_pronto"
                      ? "text-error font-bold italic"
                      : "text-on-surface-variant"
                  }`}
                >
                  {p.vencimiento}
                </td>
                <td className="px-md py-sm font-body-md text-body-md font-medium text-on-surface">
                  {p.precio}
                </td>
                <td className="px-md py-sm">
                  <Badge status={p.estado} />
                </td>
                <td className="px-md py-sm text-center">
                  <div className="flex justify-center gap-xs">
                    <button className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded transition-all">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-all">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

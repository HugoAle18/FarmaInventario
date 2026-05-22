"use client"

import Select from "@/components/ui/select"

const categoriaOptions = [
  { value: "", label: "Categoría" },
  { value: "analgesicos", label: "Analgésicos" },
  { value: "antibioticos", label: "Antibióticos" },
  { value: "vitaminas", label: "Vitaminas" },
]

const laboratorioOptions = [
  { value: "", label: "Laboratorio" },
  { value: "pfizer", label: "Pfizer" },
  { value: "bayer", label: "Bayer" },
  { value: "roche", label: "Roche" },
]

const estadoOptions = [
  { value: "", label: "Estado" },
  { value: "disponible", label: "Disponible" },
  { value: "stock_bajo", label: "Stock Bajo" },
  { value: "agotado", label: "Agotado" },
]

export default function ProductFilters({
  categoria,
  laboratorio,
  estado,
  onCategoriaChange,
  onLaboratorioChange,
  onEstadoChange,
}: {
  categoria: string
  laboratorio: string
  estado: string
  onCategoriaChange: (v: string) => void
  onLaboratorioChange: (v: string) => void
  onEstadoChange: (v: string) => void
}) {
  return (
    <div className="flex gap-xs">
      <Select
        options={categoriaOptions}
        value={categoria}
        onChange={onCategoriaChange}
      />
      <Select
        options={laboratorioOptions}
        value={laboratorio}
        onChange={onLaboratorioChange}
      />
      <Select
        options={estadoOptions}
        value={estado}
        onChange={onEstadoChange}
      />
    </div>
  )
}

import { getVentas } from "@/lib/supabase/queries"

export default async function VentasPage() {
  let ventas: any[] = []

  try {
    ventas = await getVentas()
  } catch {}

  const totalVentas = ventas.reduce((sum, v) => sum + Number(v.total), 0)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div className="space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary">Ventas</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Historial de transacciones y detalle de ventas.
          </p>
        </div>
        <div className="bg-surface-container-lowest px-lg py-md rounded-xl border border-outline-variant">
          <p className="font-label-caps text-label-caps text-on-surface-variant">TOTAL VENTAS</p>
          <p className="font-headline-md text-headline-md text-secondary font-bold">
            S/ {totalVentas.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Total
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-md py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Vendedor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {ventas.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                    {new Date(v.fecha_venta).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md font-semibold text-on-surface">
                    {v.cliente_nombre ?? "Cliente general"}
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant mono-font">
                    {v.cliente_documento ?? "-"}
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                    {v.detalle_ventas?.length ?? 0} ítems
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md font-bold text-secondary">
                    S/ {Number(v.total).toFixed(2)}
                  </td>
                  <td className="px-md py-sm">
                    <span className="capitalize font-body-md text-body-md text-on-surface-variant">
                      {v.metodo_pago}
                    </span>
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                    {v.usuarios_farmacia?.nombre ?? "-"}
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-xl text-on-surface-variant font-body-md">
                    No hay ventas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

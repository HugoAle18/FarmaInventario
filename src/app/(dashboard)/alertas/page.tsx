import { createClient } from "@/lib/supabase/server"

export default async function AlertasPage() {
  let alertas: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("alertas")
      .select(`*, productos(nombre, codigo_sku)`)
      .order("created_at", { ascending: false })
      .limit(50)
    alertas = data ?? []
  } catch {}

  const noLeidas = alertas.filter((a) => !a.leida).length

  const tipoColors: Record<string, string> = {
    stock_bajo: "bg-amber-100 text-amber-800 border-amber-200",
    lote_por_vencer: "bg-orange-100 text-orange-700 border-orange-200",
    vencido: "bg-error-container text-on-error-container border-error/20",
  }

  const tipoLabels: Record<string, string> = {
    stock_bajo: "Stock Bajo",
    lote_por_vencer: "Por Vencer",
    vencido: "Vencido",
  }

  return (
    <>
      <div className="flex items-center gap-lg mb-xl">
        <div className="space-y-xs flex-1">
          <h2 className="font-headline-lg text-headline-lg text-primary">Alertas</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Notificaciones de stock bajo, lotes por vencer y vencidos.
          </p>
        </div>
        <div className="bg-error-container px-lg py-md rounded-xl border border-error/20">
          <p className="font-label-caps text-label-caps text-on-error-container">SIN LEER</p>
          <p className="font-headline-md text-headline-md text-on-error-container font-bold">
            {noLeidas}
          </p>
        </div>
      </div>

      <div className="space-y-xs">
        {alertas.map((a) => (
          <div
            key={a.id}
            className={`flex items-center gap-md p-md rounded-xl border transition-colors ${
              a.leida
                ? "bg-surface-container-lowest border-outline-variant"
                : "bg-surface-container-lowest border-l-4 border-l-error shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                a.tipo === "vencido"
                  ? "bg-error/10"
                  : a.tipo === "stock_bajo"
                    ? "bg-amber-100"
                    : "bg-orange-100"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  a.tipo === "vencido"
                    ? "text-error"
                    : a.tipo === "stock_bajo"
                      ? "text-amber-600"
                      : "text-orange-600"
                }`}
              >
                {a.tipo === "vencido"
                  ? "event_busy"
                  : a.tipo === "stock_bajo"
                    ? "inventory"
                    : "notification_important"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-sm">
                <h4 className="font-body-lg text-body-lg text-primary leading-tight">
                  {a.productos?.nombre ?? "Producto"}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    tipoColors[a.tipo] ?? ""
                  }`}
                >
                  {tipoLabels[a.tipo] ?? a.tipo}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">{a.mensaje}</p>
              <p className="text-[11px] text-on-surface-variant mt-xs">
                {new Date(a.created_at).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {alertas.length === 0 && (
          <div className="text-center py-xl text-on-surface-variant font-body-md bg-surface-container-lowest rounded-xl border border-outline-variant">
            No hay alertas registradas.
          </div>
        )}
      </div>
    </>
  )
}

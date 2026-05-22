import KpiCard from "@/components/dashboard/kpi-card"
import { getDashboardStats, getAlertasCriticas } from "@/lib/supabase/queries"

export default async function DashboardPage() {
  let stats = {
    totalProductos: 0,
    stockBajo: 0,
    porVencer: 0,
    ventasHoy: 0,
  }
  let alertas: any[] = []

  try {
    const [s, a] = await Promise.all([getDashboardStats(), getAlertasCriticas()])
    stats = s
    alertas = a
  } catch {
    // Sin conexión a Supabase aún
  }

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <KpiCard
          label="Total Productos"
          value={stats.totalProductos.toLocaleString()}
          trend={stats.totalProductos > 0 ? `${stats.totalProductos} registrados` : undefined}
          icon="inventory"
          iconColor="text-primary"
        />
        <KpiCard
          label="Stock Bajo"
          value={stats.stockBajo}
          icon="warning"
          iconColor="text-amber-600"
          borderColor="border-l-4 border-l-amber-500"
          badge={{
            text: "Acción requerida",
            className: "text-amber-700 bg-amber-100",
          }}
        />
        <KpiCard
          label="Por Vencer"
          value={stats.porVencer}
          icon="notification_important"
          iconColor="text-error"
          borderColor="border-l-4 border-l-error"
          badge={{
            text: "Revisar lotes",
            className: "text-error bg-error-container",
          }}
        />
        <KpiCard
          label="Ventas Hoy"
          value={`S/ ${stats.ventasHoy.toLocaleString()}`}
          icon="payments"
          iconColor="text-secondary"
          badge={{
            text: "Últimas 24h",
            className: "text-secondary bg-secondary-container",
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Chart Area */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h2 className="font-headline-sm text-headline-sm">Movimiento de Stock</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Últimos 7 días de operación
              </p>
            </div>
            <select className="bg-surface border-outline-variant rounded-lg font-label-caps text-label-caps py-xs px-sm focus:ring-secondary">
              <option>Semana Actual</option>
              <option>Mes Pasado</option>
            </select>
          </div>
          <div className="h-[300px] w-full relative">
            <div className="absolute inset-0 flex items-end justify-between px-xs h-[240px]">
              <div className="absolute inset-0 flex justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-full border-l border-outline-variant/30" />
                ))}
              </div>
              <div
                className="absolute inset-0 chart-gradient"
                style={{
                  clipPath:
                    "polygon(0 80%, 16% 65%, 33% 85%, 50% 45%, 66% 60%, 83% 20%, 100% 35%, 100% 100%, 0% 100%)",
                }}
              />
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <path
                  d="M 0 192 L 138 156 L 276 204 L 414 108 L 552 144 L 690 48 L 828 84"
                  fill="none"
                  stroke="#006c49"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
                {([
                  [0, 192],
                  [138, 156],
                  [276, 204],
                  [414, 108],
                  [552, 144],
                  [690, 48],
                  [828, 84],
                ] as [number, number][]).map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} fill="#006c49" r={4} />
                ))}
              </svg>
            </div>
            <div className="absolute bottom-0 w-full flex justify-between font-label-caps text-[10px] text-on-surface-variant pt-xs border-t border-outline-variant">
              <span>LUN</span>
              <span>MAR</span>
              <span>MIE</span>
              <span>JUE</span>
              <span>VIE</span>
              <span>SAB</span>
              <span>DOM</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-primary-container text-on-primary p-lg rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline-sm text-headline-sm mb-xs">Acción Rápida</h3>
              <p className="font-body-md text-body-md text-on-primary-container mb-md opacity-80">
                Registra un nuevo movimiento de almacén al instante.
              </p>
              <button className="w-full bg-secondary text-white font-bold py-sm rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-colors flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined">add_box</span>
                Nueva Entrada
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">
                medical_services
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex-1">
            <h3 className="font-headline-sm text-headline-sm mb-md">Actividad Reciente</h3>
            <div className="space-y-md">
              <div className="flex items-start gap-md">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    input
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface">
                    Entrada de lote{" "}
                    <span className="font-label-technical text-label-technical">#B4502</span>
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    Hace 15 min • Almacén Central
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    shopping_cart
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface">
                    Venta realizada{" "}
                    <span className="font-label-technical text-label-technical">#V9801</span>
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    Hace 42 min • Punto de Venta 01
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">
                    history
                  </span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface">
                    Ajuste de inventario manual
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    Hace 2 horas • Dr. Sanchez
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-lg py-xs text-secondary font-label-caps text-label-caps hover:bg-secondary/5 transition-colors rounded-lg">
              Ver todo el historial
            </button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="col-span-12 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-sm mb-lg">
            <span
              className="material-symbols-outlined text-error"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
            <h2 className="font-headline-sm text-headline-sm">
              Alertas Críticas de Inventario
            </h2>
          </div>
          <div className="overflow-x-auto">
            {alertas.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="pb-sm font-label-caps text-label-caps text-on-surface-variant">
                      Producto
                    </th>
                    <th className="pb-sm font-label-caps text-label-caps text-on-surface-variant">
                      Tipo
                    </th>
                    <th className="pb-sm font-label-caps text-label-caps text-on-surface-variant">
                      Mensaje
                    </th>
                    <th className="pb-sm font-label-caps text-label-caps text-on-surface-variant">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {alertas.map((alerta) => (
                    <tr key={alerta.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-md font-body-md font-semibold text-on-surface">
                        {alerta.productos?.nombre}
                      </td>
                      <td className="py-md">{alerta.tipo}</td>
                      <td className="py-md font-body-md text-body-md text-on-surface-variant">
                        {alerta.mensaje}
                      </td>
                      <td className="py-md font-body-md text-body-md text-on-surface-variant">
                        {new Date(alerta.created_at).toLocaleDateString("es-PE")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant py-md">
                No hay alertas críticas en este momento.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 lg:bottom-6 lg:right-6 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50">
        <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
      </button>
    </>
  )
}

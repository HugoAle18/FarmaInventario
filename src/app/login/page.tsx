import { login } from "@/app/actions/auth"

export default async function LoginPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 min-w-0 bg-primary-container relative items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary"
            style={{ filter: "blur(80px)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-secondary-fixed"
            style={{ filter: "blur(100px)" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-lg py-xl text-center">
          <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-lg shadow-lg shadow-secondary/30">
            <span className="material-symbols-outlined text-white text-[44px]">
              medical_services
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-primary font-bold whitespace-normal">
            FarmaInventario
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container mt-md whitespace-normal">
            Sistema inteligente de gestión de inventario para farmacias.
            Controla stock, lotes, ventas y más desde un solo lugar.
          </p>

          <div className="flex flex-col gap-md mt-xl w-full max-w-sm mx-auto">
            <div className="flex items-center gap-md text-left">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">inventory_2</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-md text-body-md font-semibold text-on-primary whitespace-normal">
                  Control de Stock
                </p>
                <p className="text-[12px] text-on-primary-container/70 whitespace-normal">
                  Tiempo real con alertas inteligentes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-md text-left">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">event_note</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-md text-body-md font-semibold text-on-primary whitespace-normal">
                  Trazabilidad de Lotes
                </p>
                <p className="text-[12px] text-on-primary-container/70 whitespace-normal">
                  Control de vencimientos y lotes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-md text-left">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">bar_chart</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-md text-body-md font-semibold text-on-primary whitespace-normal">
                  Reportes
                </p>
                <p className="text-[12px] text-on-primary-container/70 whitespace-normal">
                  Ventas, movimientos y estadísticas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 min-w-0 flex items-center justify-center bg-surface py-lg px-md">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-xl">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-md shadow-lg shadow-secondary/30">
              <span className="material-symbols-outlined text-white text-[36px]">
                medical_services
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold whitespace-normal">
              FarmaInventario
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs whitespace-normal">
              Pharmacy Management
            </p>
          </div>

          <div className="bg-surface-container-lowest px-xl py-xl rounded-2xl border border-outline-variant shadow-sm">
            <div className="mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-primary whitespace-normal">
                Iniciar Sesión
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs whitespace-normal">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            {error && (
              <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-md text-body-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span className="whitespace-normal">
                  {error === "Invalid login credentials"
                    ? "Credenciales inválidas. Verifica tu email y contraseña."
                    : error}
                </span>
              </div>
            )}

            <form action={login} className="space-y-lg">
              <div>
                <label
                  htmlFor="email"
                  className="font-label-caps text-label-caps text-on-surface-variant block mb-xs"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    mail
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-on-surface-variant/50"
                    placeholder="admin@farmacia.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-label-caps text-label-caps text-on-surface-variant block mb-xs"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 font-body-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-on-surface-variant/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary text-on-secondary font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-secondary/30 flex items-center justify-center gap-sm"
              >
                <span>Iniciar Sesión</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </div>

          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-lg whitespace-normal">
            &copy; {new Date().getFullYear()} FarmaInventario. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

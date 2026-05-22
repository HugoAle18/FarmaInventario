import { login } from "@/app/actions/auth"
import PasswordInput from "@/components/login/password-input"

export default async function LoginPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-dvh w-full overflow-hidden">
      {/* Left Panel - #0F1B2D */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 min-w-[480px] bg-[#0F1B2D] p-12 h-full relative">
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#10B981]/5" style={{ filter: "blur(100px)" }} />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#10B981]/5" style={{ filter: "blur(100px)" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/30">
              <span className="material-symbols-outlined text-white text-[26px]">
                medical_services
              </span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              FarmaInventario
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mt-3">
              Sistema inteligente de gestión de inventario para farmacias.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#10B981] text-[22px]">inventory_2</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Control de Stock</p>
                  <p className="text-slate-400 text-xs leading-normal">Tiempo real con alertas inteligentes</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#10B981] text-[22px]">event_note</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Trazabilidad de Lotes</p>
                  <p className="text-slate-400 text-xs leading-normal">Control de vencimientos</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#10B981] text-[22px]">bar_chart</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Reportes</p>
                  <p className="text-slate-400 text-xs leading-normal">Ventas e indicadores clave</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#10B981]/30">
              <span className="material-symbols-outlined text-white text-[26px]">
                medical_services
              </span>
            </div>
            <h1 className="text-[#0F1B2D] font-bold text-2xl tracking-tight">
              FarmaInventario
            </h1>
          </div>

          {/* Login Card */}
          <div>
            <h2 className="text-[#0F1B2D] font-bold text-[28px] leading-tight tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-[#64748B] text-[15px] mt-1.5 leading-normal">
              Ingresa tus credenciales para acceder al sistema
            </p>

            {error && (
              <div className="mt-5 p-3.5 bg-red-50 text-red-700 rounded-lg text-[14px] flex items-start gap-2.5 border border-red-100">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span className="leading-normal">
                  {error === "Invalid login credentials"
                    ? "Credenciales inválidas. Verifica tu email y contraseña."
                    : error}
                </span>
              </div>
            )}

            <form action={login} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#475569] text-[13px] font-semibold mb-1.5 uppercase tracking-wider">
                  Correo electrónico
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    mail
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-3 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                    placeholder="admin@farmacia.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-[#475569] text-[13px] font-semibold uppercase tracking-wider">
                    Contraseña
                  </label>
                  <a href="#" className="text-[13px] text-[#10B981] font-medium hover:underline transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <PasswordInput />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#10B981] text-white font-semibold text-[15px] h-12 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#10B981]/25 flex items-center justify-center gap-2"
              >
                <span>Iniciar Sesión</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[#94A3B8] text-[13px] shrink-0">o continúa con</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Social buttons placeholder */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8F0] text-[#475569] text-[14px] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E2E8F0] text-[#475569] text-[14px] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-[#94A3B8] text-[13px] mt-10">
            &copy; 2026 FarmaInventario
          </p>
        </div>
      </div>
    </div>
  )
}

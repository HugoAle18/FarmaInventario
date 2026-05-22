import LoginForm from "@/components/login/login-form"

export default async function LoginPage(props: {
  searchParams?: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  return (
    <main style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      {/* Left Panel */}
      <div
        style={{
          width: "45%",
          backgroundColor: "#0F1B2D",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "white", fontSize: 26 }}>
              medical_services
            </span>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 24, letterSpacing: "-0.025em" }}>
            FarmaInventario
          </span>
        </div>

        {/* Tagline */}
        <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: "28px", margin: 0 }}>
          Sistema inteligente de gestión de inventario para farmacias.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Feature icon="inventory_2" title="Control de Stock" desc="Tiempo real con alertas inteligentes" />
          <Feature icon="event_note" title="Trazabilidad de Lotes" desc="Control de vencimientos" />
          <Feature icon="bar_chart" title="Reportes" desc="Ventas e indicadores clave" />
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400, padding: "32px" }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }} className="lg:hidden">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "white", fontSize: 26 }}>
                medical_services
              </span>
            </div>
            <h1 style={{ color: "#0F1B2D", fontWeight: 700, fontSize: 24, letterSpacing: "-0.025em", margin: 0 }}>
              FarmaInventario
            </h1>
          </div>

          <LoginForm serverError={error} />
        </div>
      </div>
    </main>
  )
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <span className="material-symbols-outlined" style={{ color: "#10B981", fontSize: 22 }}>
          {icon}
        </span>
      </div>
      <div>
        <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>{title}</p>
        <p style={{ color: "#94A3B8", fontSize: 12, lineHeight: "20px", marginTop: 2, margin: 0 }}>{desc}</p>
      </div>
    </div>
  )
}

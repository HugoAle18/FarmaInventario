"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "LUN", entrada: 120, salida: 80 },
  { name: "MAR", entrada: 200, salida: 140 },
  { name: "MIE", entrada: 150, salida: 90 },
  { name: "JUE", entrada: 80, salida: 160 },
  { name: "VIE", entrada: 240, salida: 100 },
  { name: "SAB", entrada: 180, salida: 60 },
  { name: "DOM", entrada: 100, salida: 40 },
]

export default function StockChart() {
  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <ResponsiveContainer width="99%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSalida" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9CA3AF" interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="entrada" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEntrada)" name="Entradas" />
          <Area type="monotone" dataKey="salida" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSalida)" name="Salidas" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"
import { useState } from "react"

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export default function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      <input
        id="password"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
        autoComplete="current-password"
        placeholder={placeholder || "••••••••"}
        style={{
          width: "100%",
          padding: "12px 40px 12px 12px",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          fontSize: "15px",
          color: "#1E293B",
          backgroundColor: "white",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#10B981"
          e.target.style.boxShadow = "0 0 0 2px rgba(16, 185, 129, 0.2)"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E2E8F0"
          e.target.style.boxShadow = "none"
        }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#94A3B8",
          fontSize: "20px",
          padding: "4px",
        }}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  )
}

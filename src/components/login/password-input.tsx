"use client"

import { useState } from "react"

export default function PasswordInput() {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
        lock
      </span>
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-10 pr-12 py-3 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  )
}

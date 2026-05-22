"use client"

import Sidebar from "./sidebar"
import TopAppBar from "./top-app-bar"
import BottomNav from "./bottom-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <TopAppBar />
        <main className="flex-1 p-lg pb-28 lg:pb-lg">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}

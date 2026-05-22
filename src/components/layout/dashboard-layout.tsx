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
    <div className="h-screen w-full overflow-hidden bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopAppBar />
        <main className="flex-1 min-h-0 overflow-y-auto p-lg pb-20 lg:pb-lg">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

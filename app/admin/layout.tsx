import type React from "react"
import type { Metadata } from "next"
import { Sidebar } from "./sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage retreats, bookings, and operations",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

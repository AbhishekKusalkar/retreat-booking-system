import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Your Retreat",
  description: "Complete your retreat booking in just a few steps",
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">{children}</div>
}

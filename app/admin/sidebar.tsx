"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Mountain, Calendar, Bed, BookOpen, Tag, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/retreats", label: "Retreats", icon: Mountain },
  { href: "/admin/teachers", label: "Teachers", icon: Users },
  { href: "/admin/teachers/assign", label: "Assign Teachers", icon: Users },
  { href: "/admin/teachers/assignments", label: "Assignments", icon: BookOpen },
  { href: "/admin/dates", label: "Dates", icon: Calendar },
  { href: "/admin/rooms", label: "Rooms", icon: Bed },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
  { href: "/admin/influencers", label: "Influencers", icon: Users },
  { href: "/admin/roles", label: "Roles & Security", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    localStorage.removeItem("admin_token")
    window.location.href = "/admin-login"
  }

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col shadow-md">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">Admin</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">Retreat Manager v2.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              pathname === href
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
        <p className="text-xs text-sidebar-foreground/60">© 2025 Luxury Wellness Retreats</p>
      </div>
    </aside>
  )
}

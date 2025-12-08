"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Mail, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdvancedDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 1247,
    activeRetreats: 24,
    totalRevenue: 284450,
    activeTeachers: 18,
    pendingNotifications: 3,
  })

  const [recentAssignments, setRecentAssignments] = useState([
    {
      id: 1,
      teacher: "Sarah Johnson",
      retreat: "Mountain Yoga Retreat",
      date: "2025-03-15",
      status: "Notification Sent",
    },
    {
      id: 2,
      teacher: "Michael Chen",
      retreat: "Wellness Spa Retreat",
      date: "2025-03-20",
      status: "Notification Sent",
    },
  ])

  const handleSendNotifications = async () => {
    try {
      const response = await fetch("/api/admin/send-notifications", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        alert(`Sent ${data.sent} notifications`)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Advanced Dashboard</h1>
        <Button onClick={handleSendNotifications} className="bg-primary hover:bg-primary/90 text-white gap-2">
          <Mail className="w-4 h-4" />
          Send Pending Notifications
        </Button>
      </div>

      {/* System Health */}
      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <TrendingUp className="w-5 h-5" />
            System Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-emerald-800 font-medium">Database</p>
              <Badge className="bg-green-600 mt-1">Connected</Badge>
            </div>
            <div>
              <p className="text-sm text-emerald-800 font-medium">Email Service</p>
              <Badge className="bg-green-600 mt-1">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-emerald-800 font-medium">Stripe Integration</p>
              <Badge className="bg-green-600 mt-1">Verified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Bookings", value: stats.totalBookings },
          { label: "Active Retreats", value: stats.activeRetreats },
          { label: "Revenue", value: `€${stats.totalRevenue.toLocaleString()}` },
          { label: "Teachers", value: stats.activeTeachers },
          { label: "Pending Notifications", value: stats.pendingNotifications },
        ].map((metric, i) => (
          <Card key={i} className="rounded-xl shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="rounded-xl shadow-md border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Teacher Assignments
          </CardTitle>
          <CardDescription>Latest retreat assignments sent to teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{assignment.teacher}</p>
                  <p className="text-sm text-muted-foreground">{assignment.retreat}</p>
                  <p className="text-xs text-muted-foreground mt-1">{assignment.date}</p>
                </div>
                <Badge className="bg-green-600">{assignment.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle>Teacher Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/teachers">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View All Teachers
              </Button>
            </Link>
            <Link href="/admin/teachers/assign">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Assign New Teacher
              </Button>
            </Link>
            <Link href="/admin/teachers/assignments">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View Assignments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/roles">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Manage Roles & Permissions
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
              Email Settings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
              Backup Database
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

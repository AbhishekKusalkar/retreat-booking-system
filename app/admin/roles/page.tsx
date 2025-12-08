"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, UserCog } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AdminUser {
  id: string
  email: string
  role: string
  isActive: boolean
  lastLogin?: string
}

export default function RolesManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching admins:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-blue-100 text-blue-800",
      VIEWER: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <UserCog className="w-8 h-8" />
          Role Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage admin users and their permissions</p>
      </div>

      <Card className="rounded-xl shadow-md border-border">
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>User roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(admin.role)}>{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.isActive ? "default" : "secondary"}>
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Lock className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Admin</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Full access to all features</li>
                <li>✓ Manage teachers and roles</li>
                <li>✓ View all reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Manager</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Manage retreats and bookings</li>
                <li>✓ Manage teachers</li>
                <li>✓ View reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Viewer</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ View all data</li>
                <li>✗ Cannot make changes</li>
                <li>✗ Cannot manage users</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

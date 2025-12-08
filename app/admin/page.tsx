"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Mountain, BookOpen, DollarSign, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const bookingData = [
  { month: "Jan", bookings: 12, revenue: 4800 },
  { month: "Feb", bookings: 19, revenue: 7200 },
  { month: "Mar", bookings: 15, revenue: 6500 },
  { month: "Apr", bookings: 22, revenue: 9200 },
]

const statusData = [
  { name: "Confirmed", value: 45 },
  { name: "Pending", value: 12 },
  { name: "Cancelled", value: 8 },
]

const COLORS = ["#009444", "#F45A8D", "#FF8FB4"]

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your retreat booking system</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/roles">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Lock className="w-4 h-4" />
              Manage Roles
            </Button>
          </Link>
          <Link href="/admin/teachers/assign">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Users className="w-4 h-4" />
              Assign Teachers
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Alert */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5" />
            Security Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800">
          <p>
            Your admin portal is protected with role-based access control. Keep your credentials secure and never share
            your login information.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Retreats</CardTitle>
            <Mountain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">8 new this quarter</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">$284,450</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Teachers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">18</div>
            <p className="text-xs text-muted-foreground">5 new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle className="text-primary">Bookings & Revenue</CardTitle>
            <CardDescription>Monthly trends over the past 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#009444" />
                <Bar dataKey="revenue" fill="#F45A8D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle className="text-primary">Booking Status</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-xl shadow-md border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/retreats">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Manage Retreats
              </Button>
            </Link>
            <Link href="/admin/teachers">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Manage Teachers
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

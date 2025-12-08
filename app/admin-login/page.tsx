"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "admin123",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [seedMessage, setSeedMessage] = useState("")

  useEffect(() => {
    const seedAdmin = async () => {
      try {
        const response = await fetch("/api/admin/auth/seed", {
          method: "POST",
        })

        console.log("[v0] Seed response status:", response.status)

        // Try to parse as JSON, fall back to text if not JSON
        let data
        const contentType = response.headers.get("content-type")

        if (contentType?.includes("application/json")) {
          data = await response.json()
        } else {
          const text = await response.text()
          console.error("[v0] Seed API returned non-JSON:", text.substring(0, 100))
          setSeedMessage("Database not initialized. Please run: npx prisma migrate dev")
          return
        }

        console.log("[v0] Seed response:", data)

        if (data.skip) {
          setSeedMessage("⚠️ " + (data.message || "Database setup required"))
        } else if (data.success || data.message) {
          console.log("[v0] Admin user ready")
          setSeedMessage("")
        }
      } catch (err) {
        console.error("[v0] Seed error:", err)
        setSeedMessage("Note: Database initialization may be needed")
      }
    }

    if (process.env.NODE_ENV !== "production") {
      seedAdmin()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[v0] Attempting login with:", formData.email)

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Login response status:", response.status)

      if (!response.ok) {
        let errorData
        try {
          const contentType = response.headers.get("content-type")
          if (contentType?.includes("application/json")) {
            errorData = await response.json()
            setError(errorData.error || "Login failed")
          } else {
            const text = await response.text()
            console.error("[v0] API returned non-JSON error:", text.substring(0, 100))
            setError("Server error. Please ensure database is initialized: npx prisma migrate dev")
          }
        } catch (parseErr) {
          console.error("[v0] Failed to parse error response:", parseErr)
          setError("Server error. Please try again or check database connection.")
        }
        return
      }

      const data = await response.json()
      console.log("[v0] Login successful")
      localStorage.setItem("admin_token", data.token)
      router.push("/admin")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
      console.error("[v0] Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Luxury Wellness Retreats Management</p>
          </div>

          {seedMessage && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              {seedMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Default credentials (development): admin@example.com / admin123
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-medium"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

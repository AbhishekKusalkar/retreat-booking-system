"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"

interface Retreat {
  id: string
  name: string
  location: string
  retreatDates: {
    id: string
    startDate: string
    endDate: string
  }[]
}

interface Teacher {
  id: string
  name: string
  email: string
}

export default function TeacherAssignPage() {
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    teacherId: "",
    retreatId: "",
    retreatDateId: "",
    role: "Instructor",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [retreatsRes, teachersRes] = await Promise.all([fetch("/api/retreats"), fetch("/api/teachers")])

      if (retreatsRes.ok) setRetreats(await retreatsRes.json())
      if (teachersRes.ok) setTeachers(await teachersRes.json())
    } catch (err) {
      setError("Failed to load data")
      console.error("[v0] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.teacherId || !formData.retreatId || !formData.retreatDateId) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/teachers/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to assign teacher")
      }

      setSuccess("Teacher assigned successfully! Notification email sent.")
      setFormData({ teacherId: "", retreatId: "", retreatDateId: "", role: "Instructor" })
      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign teacher")
    }
  }

  const selectedRetreat = retreats.find((r) => r.id === formData.retreatId)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Assign Teachers to Retreats</h1>
        <p className="text-muted-foreground mt-2">
          Assign instructors to retreat dates and send automated notifications
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle>New Assignment</CardTitle>
            <CardDescription>Select a teacher and retreat date</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleAssign} className="space-y-6">
              <div>
                <Label htmlFor="teacher">Select Teacher *</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger id="teacher" className="mt-2">
                    <SelectValue placeholder="Choose a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="retreat">Select Retreat *</Label>
                <Select
                  value={formData.retreatId}
                  onValueChange={(value) => setFormData({ ...formData, retreatId: value, retreatDateId: "" })}
                >
                  <SelectTrigger id="retreat" className="mt-2">
                    <SelectValue placeholder="Choose a retreat" />
                  </SelectTrigger>
                  <SelectContent>
                    {retreats.map((retreat) => (
                      <SelectItem key={retreat.id} value={retreat.id}>
                        {retreat.name} - {retreat.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRetreat && (
                <div>
                  <Label htmlFor="date">Select Retreat Date *</Label>
                  <Select
                    value={formData.retreatDateId}
                    onValueChange={(value) => setFormData({ ...formData, retreatDateId: value })}
                  >
                    <SelectTrigger id="date" className="mt-2">
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRetreat.retreatDates.map((date) => (
                        <SelectItem key={date.id} value={date.id}>
                          {new Date(date.startDate).toLocaleDateString()} -{" "}
                          {new Date(date.endDate).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instructor">Instructor</SelectItem>
                    <SelectItem value="Facilitator">Facilitator</SelectItem>
                    <SelectItem value="Guest Speaker">Guest Speaker</SelectItem>
                    <SelectItem value="Yoga Instructor">Yoga Instructor</SelectItem>
                    <SelectItem value="Meditation Guide">Meditation Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-medium">
                Assign Teacher & Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-border bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Assignment Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-1">1. Select Teacher</p>
              <p>Choose an instructor from your database</p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Choose Retreat</p>
              <p>Select the retreat and specific date</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Set Role</p>
              <p>Define the teacher's role in the retreat</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Automated Email</p>
              <p>Teacher receives retreat details automatically</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

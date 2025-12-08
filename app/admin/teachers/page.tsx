"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Teacher {
  id: string
  name: string
  email: string
  contactNumber: string
  bio?: string
  specializations: string[]
  isActive: boolean
  retreatAssignments: any[]
}

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    bio: "",
    specializations: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/teachers")
      if (!response.ok) throw new Error("Failed to fetch teachers")
      const data = await response.json()
      setTeachers(data)
    } catch (err) {
      setError("Failed to load teachers")
      console.error("[v0] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        specializations: formData.specializations.split(",").map((s) => s.trim()),
      }

      const response = await fetch("/api/teachers", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      })

      if (!response.ok) throw new Error("Failed to save teacher")

      await fetchTeachers()
      setFormData({ name: "", email: "", contactNumber: "", bio: "", specializations: "" })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError("Failed to save teacher")
      console.error("[v0] Error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return

    try {
      const response = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete teacher")
      await fetchTeachers()
    } catch (err) {
      setError("Failed to delete teacher")
      console.error("[v0] Error:", err)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Users className="w-8 h-8" />
            Teachers Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage retreat instructors and facilitators</p>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
              <DialogDescription>Enter teacher details</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief bio"
                />
              </div>

              <div>
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Input
                  id="specializations"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="Yoga, Meditation, Wellness"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                {editingId ? "Update Teacher" : "Add Teacher"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Loading teachers...</CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl shadow-md border-border">
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>Total: {teachers.length} teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Retreats Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.contactNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.specializations.map((spec) => (
                            <span key={spec} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.retreatAssignments.length}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => console.log("Edit", teacher.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(teacher.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

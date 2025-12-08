"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TeacherAssignment {
  id: string
  teacher: {
    name: string
    email: string
  }
  retreat: {
    name: string
    location: string
  }
  retreatDate: {
    startDate: string
    endDate: string
  }
  role: string
  notificationSent: boolean
  notificationSentAt?: string
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/teachers/assignments")
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching assignments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Teacher Assignments</h1>
        <p className="text-muted-foreground mt-2">View all teacher-to-retreat assignments</p>
      </div>

      <Card className="rounded-xl shadow-md border-border">
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>Total: {assignments.length} assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No assignments yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Retreat</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Notification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {assignment.teacher.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{assignment.teacher.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{assignment.retreat.name}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {assignment.retreat.location}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(assignment.retreatDate.startDate).toLocaleDateString()} -{" "}
                          {new Date(assignment.retreatDate.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary">{assignment.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.notificationSent ? (
                          <Badge variant="secondary">Sent</Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

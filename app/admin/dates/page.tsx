"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateForm } from "./date-form"

export default function DateManager() {
  const [retreats, setRetreats] = useState<any[]>([])
  const [selectedRetreatId, setSelectedRetreatId] = useState<string>("")
  const [dates, setDates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDate, setEditingDate] = useState<any>(null)

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        const response = await fetch("/api/retreats")
        const data = await response.json()
        setRetreats(data)
        if (data.length > 0) {
          setSelectedRetreatId(data[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch retreats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRetreats()
  }, [])

  useEffect(() => {
    if (!selectedRetreatId) {
      setDates([])
      return
    }

    const fetchDates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/retreats/${selectedRetreatId}/dates`)
        const data = await response.json()
        setDates(data)
      } catch (error) {
        console.error("Failed to fetch dates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDates()
  }, [selectedRetreatId])

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingDate(null)
    if (selectedRetreatId) {
      fetch(`/api/retreats/${selectedRetreatId}/dates`)
        .then((r) => r.json())
        .then(setDates)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Date Manager</h1>
          <p className="text-muted-foreground mt-2">Manage retreat dates and availability</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Date
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Retreat</CardTitle>
          <CardDescription>Choose a retreat to view and manage its dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedRetreatId} onValueChange={setSelectedRetreatId}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a retreat" />
            </SelectTrigger>
            <SelectContent>
              {retreats.map((retreat) => (
                <SelectItem key={retreat.id} value={retreat.id}>
                  {retreat.name} - {retreat.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {showForm && (
        <DateForm
          date={editingDate}
          retreatId={selectedRetreatId}
          onClose={() => {
            setShowForm(false)
            setEditingDate(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Retreat Dates</CardTitle>
          <CardDescription>
            {selectedRetreatId
              ? "Manage available dates and capacity for this retreat"
              : "Select a retreat to view dates"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading dates...</p>
          ) : dates.length === 0 ? (
            <p className="text-muted-foreground">
              {selectedRetreatId ? "No dates created yet. Click 'New Date' to add one." : "No retreat selected."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dates.map((date) => (
                  <TableRow key={date.id}>
                    <TableCell>{new Date(date.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(date.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{date.capacity}</TableCell>
                    <TableCell>{date._count?.bookings || date.bookings?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingDate(date)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

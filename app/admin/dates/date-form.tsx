"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DateForm({ date, retreatId, onClose, onSuccess }: any) {
  const [retreats, setRetreats] = useState<any[]>([])
  const [formData, setFormData] = useState(
    date || { retreatId: retreatId || "", startDate: "", endDate: "", capacity: "" },
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        const response = await fetch("/api/retreats")
        const data = await response.json()
        setRetreats(data)
      } catch (error) {
        console.error("Failed to fetch retreats:", error)
      }
    }

    fetchRetreats()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = date ? "PUT" : "POST"
      const url = date
      ? `/api/retreats/${formData.retreatId}/dates/${date.id}`   // PUT
      : `/api/retreats/${formData.retreatId}/dates`              // POST

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to save date:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{date ? "Edit Date" : "New Date"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Retreat</label>
            <Select
              value={formData.retreatId}
              onValueChange={(value) => setFormData({ ...formData, retreatId: value })}
              disabled={!!date}
            >
              <SelectTrigger>
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Capacity</label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || !formData.retreatId}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

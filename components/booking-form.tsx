"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"

interface BookingFormProps {
  onSubmit: (data: Record<string, any>) => void
  isLoading?: boolean
}

export function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    const guestInfo = sessionStorage.getItem("guestInfo")
    const retreatSelection = sessionStorage.getItem("retreatSelection")
    if (guestInfo) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(guestInfo) }))
    }
    if (retreatSelection) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(retreatSelection) }))
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key} className="capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <Input id={key} name={key} value={value || ""} onChange={handleChange} />
          </div>
        ))}
        <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </form>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "../progress-bar"

const STEPS = ["Guest Info", "Retreat", "Payment", "Confirmation"]

export default function GuestInfoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      sessionStorage.setItem("guestInfo", JSON.stringify(formData))
      router.push("/booking/retreat")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <>
      <ProgressBar current={0} total={STEPS.length} steps={STEPS} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8 border-0 shadow-md rounded-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Guest Information</h1>
            <p className="mt-2 text-gray-600">Let us know who you are</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-2 rounded-lg border-border ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder=""
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-2 rounded-lg border-border ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder=""
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-2 rounded-lg border-border ${errors.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-2 rounded-lg border-border ${errors.phone ? "border-red-500" : ""}`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg h-11 font-medium transition-all shadow-md"
              >
                {isLoading ? "Processing..." : "Continue to Retreat Selection"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

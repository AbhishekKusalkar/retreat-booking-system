"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PackageManager() {
  const [packages, setPackages] = useState<any[]>([])
  const [retreats, setRetreats] = useState<any[]>([])
  const [selectedRetreat, setSelectedRetreat] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    durationDays: "6",
    maxGuests: "",
    amenities: "",
    inclusions: "",
    features: "",
    displayOrder: "0",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/retreats")
        const data = await response.json()
        setRetreats(data)
      } catch (error) {
        console.error("Failed to fetch retreats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedRetreat) {
      setPackages([])
      return
    }

    const fetchPackages = async () => {
      try {
        const response = await fetch(`/api/retreats/${selectedRetreat}/packages`)
        const data = await response.json()
        setPackages(data)
      } catch (error) {
        console.error("Failed to fetch packages:", error)
      }
    }

    fetchPackages()
  }, [selectedRetreat])

  async function handleCreatePackage() {
    if (!selectedRetreat) {
      alert("Please select a retreat first.")
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      pricePerNight: Number(form.pricePerNight),
      durationDays: Number(form.durationDays),
      maxGuests: Number(form.maxGuests),
      amenities: form.amenities.split(",").map((a) => a.trim()),
      inclusions: form.inclusions.split(",").map((i) => i.trim()),
      features: form.features.split(",").map((f) => f.trim()),
      displayOrder: Number(form.displayOrder),
    }

    try {
      const response = await fetch(`/api/retreats/${selectedRetreat}/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowForm(false)
        setForm({
          name: "",
          description: "",
          pricePerNight: "",
          durationDays: "6",
          maxGuests: "",
          amenities: "",
          inclusions: "",
          features: "",
          displayOrder: "0",
        })
        alert("Package created successfully!")

        // Refresh packages
        const res = await fetch(`/api/retreats/${selectedRetreat}/packages`)
        const data = await res.json()
        setPackages(data)
      } else {
        const errorData = await response.json()
        alert(`Failed to create package: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error creating package:", error)
      alert("Error creating package. Please try again.")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Package Manager</h1>
          <p className="text-muted-foreground mt-2">Create and manage retreat packages with tiered pricing</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Package
        </Button>
      </div>

      {/* Retreat Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Retreat</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="w-full border p-3 rounded-lg"
            value={selectedRetreat}
            onChange={(e) => setSelectedRetreat(e.target.value)}
          >
            <option value="">Choose a retreat...</option>
            {retreats.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Packages Table */}
      {selectedRetreat && (
        <Card>
          <CardHeader>
            <CardTitle>Packages</CardTitle>
            <CardDescription>Manage available packages for this retreat</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading packages...</p>
            ) : packages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No packages created yet. Create your first package!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Max Guests</TableHead>
                    <TableHead>Inclusions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.durationDays} days</TableCell>
                      <TableCell>€{pkg.pricePerNight?.toFixed(2) || "0.00"}/night</TableCell>
                      <TableCell>{pkg.maxGuests}</TableCell>
                      <TableCell className="text-sm">
                        {pkg.inclusions?.slice(0, 2).join(", ")}
                        {pkg.inclusions?.length > 2 ? "..." : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Create Package Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Package Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Standard, Premium, Luxury"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Package description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price Per Night (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.pricePerNight}
                  onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                  placeholder="150"
                />
              </div>

              <div>
                <Label>Duration (Days)</Label>
                <Input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                  placeholder="6"
                />
              </div>

              <div>
                <Label>Max Guests</Label>
                <Input
                  type="number"
                  value={form.maxGuests}
                  onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                  placeholder="4"
                />
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label>Amenities (comma-separated)</Label>
              <Input
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                placeholder="WiFi, Parking, AC, TV"
              />
            </div>

            <div>
              <Label>Inclusions (comma-separated)</Label>
              <Input
                value={form.inclusions}
                onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                placeholder="Breakfast, Lunch, Dinner, Yoga, Spa"
              />
            </div>

            <div>
              <Label>Features (comma-separated)</Label>
              <Input
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Ocean View, Balcony, Hot Tub, Private"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePackage}>Create Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

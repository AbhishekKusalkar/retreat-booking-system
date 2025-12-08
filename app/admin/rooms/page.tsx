"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function RoomManager() {
  const [rooms, setRooms] = useState<any[]>([])
  const [retreats, setRetreats] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [selectedRetreat, setSelectedRetreat] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    durationDays: "6",
    maxGuests: "",
    packageId: "",
  })

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/retreats")
        const data = await response.json()

        setRetreats(data)
        const allRooms = data.flatMap((r: any) =>
          (r.roomTypes || []).map((room: any) => ({
            ...room,
            retreatName: r.name,
          })),
        )
        setRooms(allRooms)
      } catch (error) {
        console.error("Failed to fetch rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
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

  async function handleCreateRoom() {
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
      amenities: [],
      packageId: form.packageId || null,
    }

    try {
      const response = await fetch(`/api/retreats/${selectedRetreat}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowForm(false)
        setForm({ name: "", description: "", pricePerNight: "", durationDays: "6", maxGuests: "", packageId: "" })
        alert("Room type created successfully!")

        // Refresh rooms
        const res = await fetch("/api/retreats")
        const data = await res.json()
        const allRooms = data.flatMap((r: any) =>
          (r.roomTypes || []).map((room: any) => ({
            ...room,
            retreatName: r.name,
          })),
        )
        setRooms(allRooms)
      } else {
        const errorData = await response.json()
        alert(`Failed to create room: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error creating room:", error)
      alert("Error creating room. Please try again.")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Manager</h1>
          <p className="text-muted-foreground mt-2">Manage retreat room types and nightly pricing</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Room Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Types</CardTitle>
          <CardDescription>Configure available room options with pricing per night</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading rooms...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Retreat</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Max Guests</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price Per Night</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.retreatName || "Unknown"}</TableCell>
                    <TableCell>{room.package?.name || "None"}</TableCell>
                    <TableCell>{room.maxGuests}</TableCell>
                    <TableCell>{room.durationDays} days</TableCell>
                    <TableCell>€{room.pricePerNight?.toFixed(2) || "0.00"}</TableCell>
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Room Type</DialogTitle>
          </DialogHeader>

          <Label>Select Retreat</Label>
          <select
            className="border p-2 w-full rounded"
            value={selectedRetreat}
            onChange={(e) => setSelectedRetreat(e.target.value)}
          >
            <option value="">Select retreat...</option>
            {retreats.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {selectedRetreat && (
            <>
              <Label>Room Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Private Single Room, Twin Share Room"
              />

              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Room details and amenities"
              />

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
                  <Label>Link to Package (Optional)</Label>
                  <select
                    className="border p-2 w-full rounded"
                    value={form.packageId}
                    onChange={(e) => setForm({ ...form, packageId: e.target.value })}
                  >
                    <option value="">No package</option>
                    {packages.map((pkg: any) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRoom}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

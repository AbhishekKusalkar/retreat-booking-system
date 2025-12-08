"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function InfluencerManager() {
  const [influencers, setInfluencers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    imageUrl: "",
  })

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch("/api/influencers")
        const data = await response.json()
        setInfluencers(data)
      } catch (error) {
        console.error("Failed to fetch influencers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencers()
  }, [])

  const handleCreateInfluencer = async () => {
    if (!form.name || !form.email) {
      alert("Please fill in name and email")
      return
    }

    try {
      const response = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setShowForm(false)
        setForm({ name: "", email: "", bio: "", imageUrl: "" })
        // Refresh influencers
        const res = await fetch("/api/influencers")
        const data = await res.json()
        setInfluencers(data)
      } else {
        alert("Failed to create influencer")
      }
    } catch (error) {
      console.error("Error creating influencer:", error)
      alert("Error creating influencer")
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Influencer Manager</h1>
          <p className="text-muted-foreground mt-2">Manage influencer partnerships and commissions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Influencer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Influencers</CardTitle>
          <CardDescription>All partnered influencers and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading influencers...</p>
          ) : influencers.length === 0 ? (
            <p className="text-muted-foreground">No influencers yet. Add one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencers.map((influencer) => {
                  const promoCode = influencer.promoCodes?.[0]
                  const bookingCount = promoCode?.bookings?.length || 0
                  return (
                    <TableRow key={influencer.id}>
                      <TableCell className="font-medium">{influencer.name}</TableCell>
                      <TableCell>{influencer.email}</TableCell>
                      <TableCell className="font-mono">{promoCode?.code || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          {bookingCount}
                        </div>
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
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Influencer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Influencer name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Influencer email"
              />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="About the influencer"
              />
            </div>

            <div>
              <Label>Image URL (Optional)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInfluencer}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

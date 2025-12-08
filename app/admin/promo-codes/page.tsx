"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Copy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PromoCodeManager() {
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [influencers, setInfluencers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: "",
    influencerId: "",
    discountPercentage: "10",
    isActive: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codesRes, influencersRes] = await Promise.all([fetch("/api/promo-codes"), fetch("/api/influencers")])
        const codes = await codesRes.json()
        const influencersData = await influencersRes.json()
        setPromoCodes(codes)
        setInfluencers(influencersData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreatePromoCode = async () => {
    if (!form.code || !form.influencerId) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          influencerId: form.influencerId,
          discountPercentage: Number(form.discountPercentage),
          isActive: form.isActive,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setForm({ code: "", influencerId: "", discountPercentage: "10", isActive: true })
        // Refresh promo codes
        const codesRes = await fetch("/api/promo-codes")
        const codes = await codesRes.json()
        setPromoCodes(codes)
      } else {
        alert("Failed to create promo code")
      }
    } catch (error) {
      console.error("Error creating promo code:", error)
      alert("Error creating promo code")
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert("Code copied to clipboard!")
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promo Code Manager</h1>
          <p className="text-muted-foreground mt-2">Manage influencer discount codes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Promo Code
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Promo Codes</CardTitle>
          <CardDescription>All influencer promotion codes with discount rates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading promo codes...</p>
          ) : promoCodes.length === 0 ? (
            <p className="text-muted-foreground">No promo codes yet. Create one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                    <TableCell>{promo.influencer?.name}</TableCell>
                    <TableCell>{promo.influencer?.email}</TableCell>
                    <TableCell>{promo.discountPercentage}%</TableCell>
                    <TableCell>{promo.bookings?.length || 0}</TableCell>
                    <TableCell>
                      <Badge variant={promo.isActive ? "default" : "secondary"}>
                        {promo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyCode(promo.code)}>
                          <Copy className="w-4 h-4" />
                        </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Promo Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Influencer</Label>
              <select
                className="w-full border p-2 rounded"
                value={form.influencerId}
                onChange={(e) => setForm({ ...form, influencerId: e.target.value })}
              >
                <option value="">Select influencer...</option>
                {influencers.map((inf) => (
                  <option key={inf.id} value={inf.id}>
                    {inf.name} ({inf.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Promo Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., INFLUENCER20"
              />
            </div>

            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePromoCode}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

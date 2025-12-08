"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RetreatForm from "./retreat-form"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function RetreatManager() {
  const [retreats, setRetreats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRetreat, setEditingRetreat] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const fetchRetreats = async () => {
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

    fetchRetreats()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/retreats/${id}`, { method: "DELETE" })
      setRetreats(retreats.filter((r) => r.id !== id))
      setDeleteId(null)
    } catch (error) {
      console.error("Failed to delete retreat:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Retreat Manager</h1>
          <p className="text-muted-foreground mt-2">Create and manage retreat offerings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Retreat
        </Button>
      </div>

      {showForm && (
        <RetreatForm
          retreat={editingRetreat}
          onClose={() => {
            setShowForm(false)
            setEditingRetreat(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setEditingRetreat(null)
            // Refetch retreats
            fetch("/api/retreats")
              .then((r) => r.json())
              .then(setRetreats)
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Retreats</CardTitle>
          <CardDescription>Manage your retreat catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading retreats...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retreats.map((retreat) => (
                  <TableRow key={retreat.id}>
                    <TableCell className="font-medium">{retreat.name}</TableCell>
                    <TableCell>{retreat.location}</TableCell>
                    <TableCell>${retreat.basePrice}</TableCell>
                    <TableCell>{retreat._count?.dates || 0} dates</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingRetreat(retreat)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteId(retreat.id)}>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Retreat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this retreat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Delete</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

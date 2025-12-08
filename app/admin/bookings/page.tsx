"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-500/10 text-green-700",
  PENDING: "bg-yellow-500/10 text-yellow-700",
  CANCELLED: "bg-red-500/10 text-red-700",
}

interface Booking {
  id: string
  status: string
  totalPrice: number
  numberOfGuests: number
  guest: {
    firstName: string
    lastName: string
    email: string
  }
  retreat: {
    name: string
  }
  retreatDate: {
    date: string
  }
  roomType: {
    name: string
  }
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setIsUpdating(bookingId)
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        fetchBookings()
        setSelectedBooking(null)
      } else {
        alert("Failed to update booking status")
      }
    } catch (error) {
      console.error("Failed to update booking:", error)
      alert("Error updating booking")
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking List</h1>
        <p className="text-muted-foreground mt-2">View and manage all retreat bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Complete list of guest reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Retreat</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedBooking(booking.id)}
                    >
                      <TableCell className="font-medium">{`${booking.guest.firstName} ${booking.guest.lastName}`}</TableCell>
                      <TableCell>{booking.guest.email}</TableCell>
                      <TableCell>{booking.retreat.name}</TableCell>
                      <TableCell>{new Date(booking.retreatDate.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.roomType.name}</TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell className="font-medium">€{booking.totalPrice}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {selectedBooking === booking.id ? (
                          <div className="flex gap-2">
                            {booking.status !== "CONFIRMED" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                                disabled={isUpdating === booking.id}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                Confirm
                              </Button>
                            )}
                            {booking.status !== "CANCELLED" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                                disabled={isUpdating === booking.id}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBooking(booking.id)}
                            className="text-xs"
                          >
                            Manage
                          </Button>
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

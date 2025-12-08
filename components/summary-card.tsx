"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SummaryCardProps {
  retreatName: string
  location: string
  startDate: string
  endDate: string
  roomType: string
  numberOfGuests: number
  pricePerNight: number
  numberOfNights: number
  subtotal: number
  discount?: number
  tax?: number
  total: number
  promoCode?: string
}

export function SummaryCard({
  retreatName,
  location,
  startDate,
  endDate,
  roomType,
  numberOfGuests,
  pricePerNight,
  numberOfNights,
  subtotal,
  discount,
  tax,
  total,
  promoCode,
}: SummaryCardProps) {
  return (
    <Card className="rounded-xl shadow-md border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary">{retreatName}</CardTitle>
        <CardDescription className="text-gray-600">{location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs font-medium">Check-in</p>
            <p className="font-semibold text-foreground">{startDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs font-medium">Check-out</p>
            <p className="font-semibold text-foreground">{endDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs font-medium">Room</p>
            <p className="font-semibold text-foreground">{roomType}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs font-medium">Guests</p>
            <p className="font-semibold text-foreground">{numberOfGuests}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              €{pricePerNight} × {numberOfNights} nights
            </span>
            <span className="font-medium text-foreground">€{subtotal.toFixed(2)}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-secondary font-medium">
              <span>
                Discount{" "}
                {promoCode && (
                  <Badge className="ml-2 bg-secondary/10 text-secondary border-secondary/30">{promoCode}</Badge>
                )}
              </span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}
          {tax && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-foreground">€{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between font-bold text-lg bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">€{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

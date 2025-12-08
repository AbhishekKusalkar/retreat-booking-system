"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "../progress-bar"

const STEPS = ["Guest Info", "Retreat", "Payment", "Confirmation"]

interface BookingData {
  retreatId: string
  dateId: string
  roomId: string
  numberOfGuests: number
  promoCode: string | null
  discount: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [summary, setSummary] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData")
    if (!data) {
      router.push("/booking/guest-info")
      return
    }
    setBookingData(JSON.parse(data))
  }, [router])

  useEffect(() => {
    if (!bookingData) return

    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/booking-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        })
        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error("Failed to fetch summary:", error)
      }
    }

    fetchSummary()
  }, [bookingData])

  const handlePayNow = async (e: FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          guestInfo: JSON.parse(sessionStorage.getItem("guestInfo") || "{}"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment session")
      }

      const { sessionId } = await response.json()

      sessionStorage.setItem("checkoutSessionId", sessionId)
      router.push("/booking/thank-you")
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to process payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!bookingData || !summary) {
    return (
      <>
        <ProgressBar current={2} total={STEPS.length} steps={STEPS} />
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="p-8 border-0 shadow-md rounded-xl">
            <p className="text-gray-600">Loading payment details...</p>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <ProgressBar current={2} total={STEPS.length} steps={STEPS} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8 border-0 shadow-md rounded-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Review & Pay</h1>
            <p className="mt-2 text-gray-600">Review your booking details before payment</p>
          </div>

          {/* Order Summary */}
          <div className="mb-8 p-6 bg-secondary/5 rounded-xl border border-secondary/20">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Retreat</span>
                <span className="font-medium text-foreground">{summary.retreatName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-foreground">{summary.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room</span>
                <span className="font-medium text-foreground">{summary.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span className="font-medium text-foreground">{summary.numberOfGuests}</span>
              </div>

              <div className="border-t border-secondary/20 my-3" />

              <div className="flex justify-between text-base">
                <span className="text-gray-600">Total Package Price</span>
                <span className="font-medium text-foreground">€{summary.subtotal.toFixed(2)}</span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between text-secondary font-medium">
                  <span>Discount ({summary.discountPercent}%)</span>
                  <span>-€{summary.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-secondary/20 my-3" />

              <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">€{summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <form onSubmit={handlePayNow} className="space-y-6">
            <div className="p-4 bg-secondary/5 border border-secondary/30 rounded-lg">
              <p className="text-sm text-secondary">
                You will be redirected to a secure Stripe payment page to complete your transaction.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-lg rounded-lg font-medium transition-all shadow-md"
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "../progress-bar"

const STEPS = ["Guest Info", "Retreat", "Payment", "Confirmation"]

export default function ThankYouPage() {
  const [bookingRef, setBookingRef] = useState("")
  const [guestInfo, setGuestInfo] = useState<any>(null)
  const [redirectCountdown, setRedirectCountdown] = useState(10)

  useEffect(() => {
    const info = sessionStorage.getItem("guestInfo")
    const sessionId = sessionStorage.getItem("checkoutSessionId")

    if (info) {
      setGuestInfo(JSON.parse(info))
    }

    if (sessionId) {
      setBookingRef(`BK-${sessionId.slice(0, 12).toUpperCase()}`)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = "https://luxurywellnessretreats.in"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRedirectNow = () => {
    window.location.href = "https://luxurywellnessretreats.in"
  }

  return (
    <>
      <ProgressBar current={3} total={STEPS.length} steps={STEPS} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8 border-0 shadow-md text-center">
          <div className="mb-6">
            <div className="inline-block p-3 bg-emerald-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">Thank you for your reservation</p>
          </div>

          <div className="my-8 p-6 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
            <div className="text-2xl font-mono font-bold text-gray-900">{bookingRef}</div>
          </div>

          {guestInfo && (
            <div className="mb-8 text-left p-6 bg-gray-50 rounded-lg">
              <h2 className="font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Guest:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {guestInfo.firstName} {guestInfo.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{guestInfo.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium text-gray-900">{guestInfo.phone}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-8">
            <p className="text-sm text-emerald-900">
              A confirmation email has been sent to <strong>{guestInfo?.email}</strong> with all booking details.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <p className="text-sm text-blue-900">
              You will be redirected to our main website in <strong>{redirectCountdown} seconds</strong>...
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleRedirectNow}>
              Go to Main Website Now
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                sessionStorage.clear()
                window.location.href = "https://luxurywellnessretreats.in"
              }}
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "../progress-bar"
import { Spinner } from "@/components/ui/spinner"

const STEPS = ["Guest Info", "Retreat", "Payment", "Confirmation"]

interface Retreat {
  id: string
  name: string
  description: string
  basePrice: number
  location: string
  retreatDates: Array<{
    id: string
    startDate: string
    endDate: string
    capacity: number
    booked: number
  }>
}

interface RoomType {
  id: string
  name: string
  maxGuests: number
  packagePrice: number
  durationDays: number
}

export default function RetreatPage() {
  const router = useRouter()
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [selectedRetreat, setSelectedRetreat] = useState("")
  const [selectedRetreatData, setSelectedRetreatData] = useState<Retreat | null>(null)
  const [dates, setDates] = useState<Retreat["retreatDates"]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [numberOfGuests, setNumberOfGuests] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoadingRetreats, setIsLoadingRetreats] = useState(true)
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRetreats = async () => {
      try {
        setError("")
        const response = await fetch("/api/retreats")
        if (!response.ok) throw new Error("Failed to fetch retreats")
        const data = await response.json()
        setRetreats(data)
      } catch (err) {
        console.error("[v0] Error fetching retreats:", err)
        setError("Unable to load retreats. Please try again.")
      } finally {
        setIsLoadingRetreats(false)
      }
    }

    fetchRetreats()
  }, [])

  useEffect(() => {
    if (!selectedRetreat) return

    const fetchDates = async () => {
      setIsLoadingDates(true)
      try {
        setError("")
        const response = await fetch(`/api/retreats/${selectedRetreat}/dates`)
        if (!response.ok) throw new Error("Failed to fetch dates")
        const data = await response.json()
        setDates(data)
        setSelectedDate("")
        setSelectedRoom("")
        setNumberOfGuests("")
        setDiscount(0)

        // Set the selected retreat data to get location
        const retreat = retreats.find((r) => r.id === selectedRetreat)
        if (retreat) {
          setSelectedRetreatData(retreat)
        }

        const roomResponse = await fetch(`/api/retreats/${selectedRetreat}/rooms`)
        if (roomResponse.ok) {
          const roomData = await roomResponse.json()
          setRooms(roomData)
        }
      } catch (err) {
        console.error("[v0] Error fetching dates:", err)
        setError("Unable to load dates. Please try again.")
      } finally {
        setIsLoadingDates(false)
      }
    }

    fetchDates()
  }, [selectedRetreat, retreats])

  // This simplifies the flow and shows rooms immediately after retreat selection

  useEffect(() => {
    if (selectedRetreatData && selectedRoom && discount >= 0) {
      const selectedRoomData = rooms.find((r) => r.id === selectedRoom)
      let price = selectedRoomData?.packagePrice || selectedRetreatData.basePrice
      if (discount > 0) {
        price = price * (1 - discount / 100)
      }
      setTotalPrice(Math.round(price * 100) / 100)
    }
  }, [selectedRetreatData, selectedRoom, discount, rooms])

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return

    setIsValidatingPromo(true)
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })

      if (response.ok) {
        const data = await response.json()
        setDiscount(data.discountPercentage)
        setError("")
      } else {
        setError("Invalid promo code")
        setDiscount(0)
        setPromoCode("")
      }
    } catch (err) {
      console.error("[v0] Error validating promo code:", err)
      setError("Error validating promo code")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedRetreat || !selectedDate || !selectedRoom || !numberOfGuests) {
      setError("Please select all options including number of guests")
      return
    }

    const guestCount = Number.parseInt(numberOfGuests)
    const selectedRoomData = rooms.find((r) => r.id === selectedRoom)

    if (selectedRoomData && guestCount > selectedRoomData.maxGuests) {
      setError(`This room accommodates maximum ${selectedRoomData.maxGuests} guests`)
      return
    }

    const selectedDateData = dates.find((d) => d.id === selectedDate)
    const availableSpots = (selectedDateData?.capacity || 0) - (selectedDateData?.booked || 0)

    if (availableSpots < guestCount) {
      setError(`Only ${availableSpots} spot(s) available for this date`)
      return
    }

    const bookingData = {
      retreatId: selectedRetreat,
      dateId: selectedDate,
      roomId: selectedRoom,
      numberOfGuests: guestCount,
      promoCode: promoCode || null,
      discount,
      totalPrice,
    }

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData))
    router.push("/booking/payment")
  }

  return (
    <>
      <ProgressBar current={1} total={STEPS.length} steps={STEPS} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8 border-0 shadow-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Retreat</h1>
            <p className="mt-2 text-gray-600">Select dates and accommodation</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Retreat</label>
              {isLoadingRetreats ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-3">
                  {retreats.map((retreat) => (
                    <label
                      key={retreat.id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRetreat === retreat.id
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="retreat"
                        value={retreat.id}
                        checked={selectedRetreat === retreat.id}
                        onChange={(e) => setSelectedRetreat(e.target.value)}
                        className="mt-1 mr-4 accent-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{retreat.name}</div>
                        <p className="text-sm text-gray-600 mt-1">Location: {retreat.location}</p>
                        <p className="text-sm text-gray-600">{retreat.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedRetreat && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  {isLoadingDates ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner />
                    </div>
                  ) : dates.length === 0 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">No dates available for this retreat yet.</p>
                    </div>
                  ) : (
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select a date...</option>
                      {dates.map((date) => {
                        const availableSpots = date.capacity - date.booked
                        return (
                          <option key={date.id} value={date.id}>
                            {new Date(date.startDate).toLocaleDateString()} -{" "}
                            {new Date(date.endDate).toLocaleDateString()} ({availableSpots} spots available)
                          </option>
                        )
                      })}
                    </select>
                  )}
                </div>

                {selectedDate && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Room Type</label>
                      {isLoadingRooms || rooms.length === 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">No room types available for this retreat.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rooms.map((room) => (
                            <label
                              key={room.id}
                              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedRoom === room.id
                                  ? "border-emerald-600 bg-emerald-50"
                                  : "border-gray-300 hover:border-gray-400 bg-white"
                              }`}
                            >
                              <input
                                type="radio"
                                name="room"
                                value={room.id}
                                checked={selectedRoom === room.id}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="mt-1 mr-4 accent-emerald-600"
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{room.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Accommodates up to {room.maxGuests} guests
                                </div>
                                <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                  €{room.packagePrice?.toFixed(2) || "0.00"} / {room.durationDays || 6}-day package
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                      <select
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select number of guests...</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "guest" : "guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Button
                      type="button"
                      onClick={handleValidatePromo}
                      disabled={isValidatingPromo || !promoCode}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      {isValidatingPromo ? "Checking..." : "Apply"}
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm font-medium text-emerald-900">Discount applied: {discount}% off</p>
                    </div>
                  )}
                </div>

                {selectedRoom && (
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-emerald-100 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Price:</span>
                      <span className="text-3xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedRetreat || !selectedDate || !selectedRoom || !numberOfGuests}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </>
            )}
          </form>
        </Card>
      </div>
    </>
  )
}

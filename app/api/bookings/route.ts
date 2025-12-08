import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { guestId, retreatId, retreatDateId, roomTypeId, promoCodeId, numberOfGuests, totalPrice } =
      await request.json()

    if (!guestId || !retreatId || !retreatDateId || !roomTypeId || !numberOfGuests || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
    })

    if (!roomType || numberOfGuests > roomType.maxGuests) {
      return NextResponse.json({ error: "Invalid room type or exceeds capacity" }, { status: 400 })
    }

    const retreatDate = await prisma.retreatDate.findUnique({
      where: { id: retreatDateId },
    })

    const availableSpots = (retreatDate?.capacity || 0) - (retreatDate?.booked || 0)
    if (!retreatDate || availableSpots < numberOfGuests) {
      return NextResponse.json({ error: "Not enough available spots for this date" }, { status: 400 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        guestId,
        retreatId,
        retreatDateId,
        roomTypeId,
        promoCodeId: promoCodeId || null,
        numberOfGuests,
        totalPrice,
        status: "PENDING",
      },
      include: {
        guest: true,
        retreat: true,
        roomType: true,
        promoCode: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        guest: true,
        retreat: true,
        retreatDate: true,
        roomType: true,
        promoCode: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { retreatDate: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (status === "CONFIRMED" && booking.status !== "CONFIRMED") {
      // Increment booked count
      await prisma.retreatDate.update({
        where: { id: booking.retreatDateId },
        data: {
          booked: {
            increment: booking.numberOfGuests,
          },
        },
      })
    } else if (status !== "CONFIRMED" && booking.status === "CONFIRMED") {
      // Decrement booked count if cancelling from confirmed
      await prisma.retreatDate.update({
        where: { id: booking.retreatDateId },
        data: {
          booked: {
            decrement: booking.numberOfGuests,
          },
        },
      })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        guest: true,
        retreat: true,
        roomType: true,
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

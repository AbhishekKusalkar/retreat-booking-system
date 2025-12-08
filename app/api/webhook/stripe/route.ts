import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real implementation, you would verify the signature using STRIPE_WEBHOOK_SECRET
    // For now, this is a basic implementation

    if (body.type === "checkout.session.completed") {
      const session = body.data.object

      // Retrieve booking using checkout session ID
      if (session.metadata?.bookingId) {
        // Update booking status to CONFIRMED
        const booking = await prisma.booking.update({
          where: { id: session.metadata.bookingId },
          data: { status: "CONFIRMED" },
          include: {
            retreatDate: true,
            guest: true,
          },
        })

        // Decrement available spots
        await prisma.retreatDate.update({
          where: { id: booking.retreatDateId },
          data: {
            availableSpots: {
              decrement: booking.numberOfGuests,
            },
          },
        })

        console.log(`[v0] Booking ${booking.id} confirmed for ${booking.guest.email}`)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmation, sendPaymentReceipt, sendInfluencerNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature")
    const body = await request.text()

    if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
    }

    let event: any
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error("[v0] Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const { bookingId, paymentType } = session.metadata || {}

      if (!bookingId) {
        console.error("[v0] No bookingId in webhook metadata")
        return NextResponse.json({ error: "Missing booking information" }, { status: 400 })
      }

      const payment = await prisma.payment.update({
        where: { stripeSessionId: session.id },
        data: {
          status: "COMPLETED",
          paidAt: new Date(),
          stripeReceiptUrl: session.receipt_email ? `https://stripe.com/receipts/${session.id}` : undefined,
          amount: (session.amount_total || 0) / 100,
        },
      })

      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: paymentType === "FULL" ? "CONFIRMED" : "CONFIRMED",
        },
        include: {
          guest: true,
          retreat: true,
          retreatDate: true,
          roomType: true,
          promoCode: {
            include: {
              influencer: true,
            },
          },
        },
      })

      await prisma.retreatDate.update({
        where: { id: booking.retreatDateId },
        data: {
          booked: {
            increment: booking.numberOfGuests,
          },
        },
      })

      const startDate = booking.retreatDate.startDate.toLocaleDateString()
      const endDate = booking.retreatDate.endDate.toLocaleDateString()
      const discount = booking.promoCode ? (booking.totalPrice * booking.promoCode.discountPercentage) / 100 : 0

      // Send emails (gracefully handle if not configured)
      try {
        await sendBookingConfirmation({
          guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
          guestEmail: booking.guest.email,
          bookingId: booking.id,
          retreatName: booking.retreat.name,
          retreatLocation: booking.retreat.location,
          startDate,
          endDate,
          roomType: booking.roomType.name,
          totalGuests: booking.numberOfGuests,
          totalPrice: booking.totalPrice,
          promoCode: booking.promoCode?.code,
          discount: discount > 0 ? discount : undefined,
          checkInTime: "3:00 PM",
          checkOutTime: "11:00 AM",
        })
      } catch (err) {
        console.error("[v0] Failed to send booking confirmation:", err)
      }

      if (booking.promoCode?.influencer) {
        try {
          const promoBookings = await prisma.booking.count({
            where: {
              promoCodeId: booking.promoCode.id,
              status: { in: ["CONFIRMED", "COMPLETED"] },
            },
          })

          const commission = booking.totalPrice * (booking.promoCode.discountPercentage / 100)

          await sendInfluencerNotification({
            influencerName: booking.promoCode.influencer.name,
            influencerEmail: booking.promoCode.influencer.email,
            promoCode: booking.promoCode.code,
            bookingCount: promoBookings,
            totalCommission: commission,
            retreatName: booking.retreat.name,
          })
        } catch (err) {
          console.error("[v0] Failed to send influencer notification:", err)
        }
      }

      try {
        await sendPaymentReceipt({
          guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
          guestEmail: booking.guest.email,
          bookingId: booking.id,
          paymentId: payment.id,
          retreatName: booking.retreat.name,
          amount: payment.amount,
          paymentType: payment.paymentType as "DEPOSIT" | "FULL",
          paidAt: payment.paidAt?.toLocaleDateString() || new Date().toLocaleDateString(),
        })
      } catch (err) {
        console.error("[v0] Failed to send payment receipt:", err)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

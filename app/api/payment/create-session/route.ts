import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { retreatId, dateId, roomId, numberOfGuests, promoCode, discount, guestInfo, totalPrice } =
      await request.json()

    if (!retreatId || !dateId || !roomId || !numberOfGuests || !guestInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get or create guest
    let guest = await prisma.guest.findUnique({
      where: { email: guestInfo.email },
    })

    if (guest) {
      guest = await prisma.guest.update({
        where: { email: guestInfo.email },
        data: {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          phone: guestInfo.phone,
        },
      })
    } else {
      guest = await prisma.guest.create({
        data: {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email,
          phone: guestInfo.phone,
        },
      })
    }

    // Fetch room and retreat data for pricing
    const room = await prisma.roomType.findUnique({
      where: { id: roomId },
    })

    const retreat = await prisma.retreat.findUnique({
      where: { id: retreatId },
    })

    if (!room || !retreat) {
      return NextResponse.json({ error: "Invalid room or retreat" }, { status: 400 })
    }

    let finalPrice = totalPrice || room.packagePrice || retreat.basePrice
    if (discount && discount > 0) {
      finalPrice = finalPrice * (1 - discount / 100)
    }

    // Create booking in PENDING status
    const booking = await prisma.booking.create({
      data: {
        guestId: guest.id,
        retreatId,
        retreatDateId: dateId,
        roomTypeId: roomId,
        numberOfGuests,
        totalPrice: Math.round(finalPrice * 100) / 100,
        status: "PENDING",
        promoCodeId: promoCode ? undefined : null,
      },
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${retreat.name} - ${room.name}`,
              description: `${numberOfGuests} guest(s) • Booking ID: ${booking.id} • Location: ${retreat.location}`,
            },
            unit_amount: Math.round(finalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/payment?cancelled=true`,
      customer_email: guest.email,
      metadata: {
        bookingId: booking.id,
        paymentType: "FULL",
      },
    })

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripeSessionId: session.id,
        paymentType: "FULL",
        amount: finalPrice,
        status: "PENDING",
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
      bookingId: booking.id,
    })
  } catch (error) {
    console.error("[v0] Error creating payment session:", error)
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}

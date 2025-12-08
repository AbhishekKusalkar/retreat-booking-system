import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
      },
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!promoCode) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 })
    }

    return NextResponse.json({
      isValid: true,
      discountPercentage: promoCode.discountPercentage,
      influencerId: promoCode.influencer.id,
      influencerName: promoCode.influencer.name,
    })
  } catch (error) {
    console.error("[v0] Error validating promo code:", error)
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code, influencerId, discountPercentage, isActive } = await request.json()

    if (!code || !influencerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        influencerId,
        discountPercentage: discountPercentage || 10,
        isActive: isActive !== false,
      },
      include: {
        influencer: true,
      },
    })

    return NextResponse.json(promoCode, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating promo code:", error)
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      include: {
        influencer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(promoCodes)
  } catch (error) {
    console.error("[v0] Error fetching promo codes:", error)
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 })
  }
}

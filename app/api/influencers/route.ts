import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, bio, imageUrl } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const influencer = await prisma.influencer.create({
      data: {
        name,
        email,
        bio,
        imageUrl,
      },
    })

    return NextResponse.json(influencer, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating influencer:", error)
    return NextResponse.json({ error: "Failed to create influencer" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const influencers = await prisma.influencer.findMany({
      include: {
        promoCodes: {
          select: {
            id: true,
            code: true,
            isActive: true,
            bookings: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(influencers)
  } catch (error) {
    console.error("[v0] Error fetching influencers:", error)
    return NextResponse.json({ error: "Failed to fetch influencers" }, { status: 500 })
  }
}

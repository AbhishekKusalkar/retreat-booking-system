import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone } = await request.json()

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let guest = await prisma.guest.findUnique({
      where: { email },
    })

    if (guest) {
      guest = await prisma.guest.update({
        where: { email },
        data: {
          firstName,
          lastName,
          phone,
        },
      })
    } else {
      guest = await prisma.guest.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
        },
      })
    }

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating/updating guest:", error)
    return NextResponse.json({ error: "Failed to create/update guest" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error("[v0] Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const roomTypes = await prisma.roomType.findMany({
      where: { retreatId: id },
      select: {
        id: true,
        name: true,
        description: true,
        maxGuests: true,
        packagePrice: true,
        durationDays: true,
        amenities: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(roomTypes)
  } catch (error) {
    console.error("[v0] Error fetching room types:", error)
    return NextResponse.json({ error: "Failed to fetch room types" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const { name, description, packagePrice, durationDays, maxGuests, amenities } = body

    if (!name || !packagePrice || !maxGuests) {
      return NextResponse.json({ error: "Missing required fields: name, packagePrice, maxGuests" }, { status: 400 })
    }

    // Convert numeric fields
    const price = Number(packagePrice)
    const guests = Number(maxGuests)
    const days = Number(durationDays) || 6

    if (isNaN(price) || isNaN(guests)) {
      return NextResponse.json({ error: "packagePrice and maxGuests must be numbers" }, { status: 400 })
    }

    const room = await prisma.roomType.create({
      data: {
        retreatId: id,
        name,
        description: description ?? "",
        packagePrice: price,
        durationDays: days,
        maxGuests: guests,
        amenities: amenities ?? [],
      },
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating room type:", error)
    return NextResponse.json({ error: "Failed to create room type" }, { status: 500 })
  }
}

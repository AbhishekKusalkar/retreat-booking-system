import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const roomTypes = await prisma.roomType.findMany({
      where: { retreatId: id },
      include: {
        package: {
          select: {
            id: true,
            name: true,
          },
        },
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

    const { name, description, packagePrice, maxGuests, amenities, packageId } = body

    if (!name || packagePrice === undefined || maxGuests === undefined) {
      return NextResponse.json({ error: "Missing required fields: name, packagePrice, maxGuests" }, { status: 400 })
    }

    const price = Number(packagePrice)
    const guests = Number(maxGuests)

    if (isNaN(price) || isNaN(guests) || price <= 0) {
      return NextResponse.json(
        { error: "packagePrice and maxGuests must be valid numbers, price must be greater than 0" },
        { status: 400 },
      )
    }

    const room = await prisma.roomType.create({
      data: {
        retreatId: id,
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        packagePrice: price,
        maxGuests: guests,
        amenities: Array.isArray(amenities) ? amenities : [],
        packageId: packageId || null,
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating room type:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to create room type", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

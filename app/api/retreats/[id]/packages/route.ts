import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const packages = await prisma.package.findMany({
      where: {
        retreatId: id,
        isActive: true,
      },
      include: {
        roomTypes: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error("[v0] Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const { name, description, pricePerNight, durationDays, maxGuests, amenities, inclusions, features, displayOrder } =
      body

    if (!name || pricePerNight === undefined || maxGuests === undefined) {
      return NextResponse.json({ error: "Missing required fields: name, pricePerNight, maxGuests" }, { status: 400 })
    }

    const price = Number(pricePerNight)
    const guests = Number(maxGuests)
    const days = Number(durationDays) || 6
    const order = Number(displayOrder) || 0

    if (isNaN(price) || isNaN(guests)) {
      return NextResponse.json({ error: "pricePerNight and maxGuests must be numbers" }, { status: 400 })
    }

    const packageData = await prisma.package.create({
      data: {
        retreatId: id,
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        pricePerNight: price,
        durationDays: days,
        maxGuests: guests,
        amenities: Array.isArray(amenities) ? amenities : [],
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        features: Array.isArray(features) ? features : [],
        displayOrder: order,
      },
      include: {
        roomTypes: true,
      },
    })

    return NextResponse.json(packageData, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating package:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to create package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

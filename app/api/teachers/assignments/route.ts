import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const assignments = await prisma.teacherRetreatAssignment.findMany({
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
        retreat: {
          select: {
            name: true,
            location: true,
          },
        },
        retreatDate: {
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("[v0] Error fetching assignments:", error)
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 })
  }
}

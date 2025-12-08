import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] Error fetching admin users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    // This endpoint is for initial setup only
    // Should be disabled after first run

    const adminCount = await prisma.adminUser.count()

    if (adminCount > 0) {
      return NextResponse.json(
        {
          error: "System already initialized",
          message: "Admin users already exist. If you need to reset, use the seed script.",
        },
        { status: 400 },
      )
    }

    // Create initial admin
    const hashedPassword = crypto.createHash("sha256").update("Admin@12345").digest("hex")

    await prisma.adminUser.create({
      data: {
        email: "admin@luxurywellnessretreats.in",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "System initialized successfully",
      credentials: {
        email: "admin@luxurywellnessretreats.in",
        password: "Admin@12345 (CHANGE THIS IMMEDIATELY)",
        loginUrl: "https://admin.book.luxurywellnessretreats.in",
      },
      warning: "Change the default password immediately after first login",
    })
  } catch (error) {
    console.error("[v0] Initialization error:", error)
    return NextResponse.json(
      {
        error: "Initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

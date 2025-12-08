import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    console.log("[v0] Starting admin user seed...")

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn("[v0] DATABASE_URL not set, skipping seed")
      return NextResponse.json({ message: "DATABASE_URL not configured", skip: true }, { status: 200 })
    }

    // Check if admin already exists
    let existingAdmin
    try {
      existingAdmin = await prisma.adminUser.findUnique({
        where: { email: "admin@example.com" },
      })

      if (existingAdmin) {
        console.log("[v0] Admin user already exists")
        return NextResponse.json({ message: "Admin user already exists", user: existingAdmin }, { status: 200 })
      }
    } catch (dbError) {
      console.error("[v0] Database query error:", dbError)
      return NextResponse.json(
        { message: "Database not initialized yet. Please run migrations.", skip: true },
        { status: 200 },
      )
    }

    // Create default admin user
    const hashedPassword = hashPassword("admin123")
    const admin = await prisma.adminUser.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    })

    console.log("[v0] Default admin user created successfully:", admin.email)

    return NextResponse.json(
      {
        success: true,
        message: "Default admin user created",
        user: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Seed error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Seed failed: ${errorMessage}`, success: false }, { status: 500 })
  }
}
